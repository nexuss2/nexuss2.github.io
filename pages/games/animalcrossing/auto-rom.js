(function () {
    var AUTO_ROM_NAME = "Animal Crossing (USA).iso";
    var AUTO_ROM_URL = new URL(AUTO_ROM_NAME, document.baseURI).href;
    var AUTO_START = true;

    function sleep(ms) {
        return new Promise(function (resolve) { setTimeout(resolve, ms); });
    }

    async function waitFor(check, label, timeoutMs) {
        var started = Date.now();
        while (Date.now() - started < timeoutMs) {
            try {
                if (check()) return true;
            } catch (e) {}
            await sleep(100);
        }
        throw new Error("Timed out waiting for " + label + ".");
    }

    function hasStoredRom() {
        try {
            return !!(window.FS && Module && Module.__rom_ready && FS.stat("/orig/user-rom.iso"));
        } catch (e) {
            return false;
        }
    }

    async function startWhenReady() {
        if (!AUTO_START) return;
        await waitFor(function () {
            return window.startBtn && !startBtn.disabled;
        }, "ROM start button", 120000);
        if (pickerEl && pickerEl.classList.contains("visible")) {
            startBtn.click();
        }
    }

    async function importBundledRom() {
        var params = new URLSearchParams(window.location.search);
        if (params.has("manual-rom")) return;

        await waitFor(function () {
            return window.FS &&
                window.Module &&
                Module.__rom_ready &&
                window.romImport &&
                typeof window.handleSelectedFile === "function";
        }, "Slider runtime", 60000);

        if (hasStoredRom()) {
            refreshRomStatus();
            await startWhenReady();
            return;
        }

        setRomDropVisible(false);
        setRomStatus("Loading bundled ROM...", "loading");

        var response = await fetch(AUTO_ROM_URL, { credentials: "same-origin" });
        if (!response.ok) {
            throw new Error(response.status + " while fetching " + AUTO_ROM_NAME);
        }

        var blob = await response.blob();
        var file = new File([blob], AUTO_ROM_NAME, { type: "application/octet-stream" });
        await handleSelectedFile(file);
        await startWhenReady();
    }

    window.addEventListener("load", function () {
        importBundledRom().catch(function (error) {
            console.error("[rom] bundled import failed:", error);
            setRomDropVisible(true);
            setRomStatus("Bundled ROM import failed: " + (error && error.message || error) + ". Drop a ROM manually.", "error");
        });
    });
})();
