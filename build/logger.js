"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
exports.logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            "timestamp": true,
            "level": "debug",
        })
    ],
});
//# sourceMappingURL=logger.js.map