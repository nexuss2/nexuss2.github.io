self.__uv$config = {
    prefix: '/ultraviolet/load/',
    bare:'https://bare2.mysticmath.workers.dev/',
    encodeUrl: Ultraviolet.codec.xor.encode,
    decodeUrl: Ultraviolet.codec.xor.decode,
    handler: '/ultraviolet/uv/uv.handler.js',
    bundle: '/ultraviolet/uv/uv.bundle.js',
    config: '/ultraviolet/uv/uv.config.js',
    sw: '/ultraviolet/uv/uv.sw.js',
}