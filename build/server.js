"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var dotenv_1 = __importDefault(require("dotenv"));
var fastify_1 = require("fastify");
var formbody_1 = __importDefault(require("@fastify/formbody"));
var static_1 = __importDefault(require("@fastify/static"));
var axios_1 = __importDefault(require("axios"));
var zod_1 = require("zod");
var nunjucks_1 = __importDefault(require("nunjucks"));
var geoCode_1 = __importDefault(require("./geoCode"));
var weather_1 = __importDefault(require("./weather"));
dotenv_1.default.config();
var environment = process.env.NODE_ENV;
var server = (0, fastify_1.fastify)({ logger: true });
var templates = new nunjucks_1.default.Environment(new nunjucks_1.default.FileSystemLoader(path_1.default.join(__dirname, 'templates')));
server.register(formbody_1.default);
server.register(static_1.default, { root: path_1.default.join(__dirname, environment === 'development' ? './dist' : './') });
var locationSchema = zod_1.z.object({
    query: zod_1.z.string()
});
function getWeatherCodeImage(code) {
    switch (code) {
        case 0: return '/images/clear.svg';
        case 1: return '/images/clear.svg';
        case 2: return '/images/cloudy.svg';
        case 3: return '/images/overCast.svg';
        case 45: return '/images/fog.svg';
        case 48: return '/images/fog.svg';
        case 51: return '/images/drizzle.svg';
        case 53: return '/images/drizzle.svg';
        case 55: return '/images/drizzle.svg';
        case 56: return '/images/drizzle.svg';
        case 57: return '/images/drizzle.svg';
        case 61: return '/images/rain.svg';
        case 63: return '/images/rain.svg';
        case 65: return '/images/rain.svg';
        case 66: return '/images/rain.svg';
        case 67: return '/images/rain.svg';
        case 71: return '/images/snow.svg';
        case 73: return '/images/snow.svg';
        case 75: return '/images/snow.svg';
        case 77: return '/images/snow.svg';
        case 80: return '/images/rain.svg';
        case 81: return '/images/rain.svg';
        case 82: return '/images/rain.svg';
        case 85: return '/images/snow.svg';
        case 86: return '/images/snow.svg';
        case 95: return '/images/thunderStorm.svg';
        case 96: return '/images/thunderStorm.svg';
        case 99: return '/images/thunderStorm.svg';
        default: return '/images/information.svg';
    }
    ;
}
;
server.get('/', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    var query, location_1, foreCast, rendered, error_1, rendered;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 4, , 6]);
                query = locationSchema.parse(request.query).query;
                return [4 /*yield*/, (0, geoCode_1.default)(axios_1.default, query)];
            case 1:
                location_1 = _a.sent();
                return [4 /*yield*/, (0, weather_1.default)(axios_1.default, location_1.latitude, location_1.longitude)];
            case 2:
                foreCast = _a.sent();
                rendered = templates.render('weather.njk', {
                    environment: environment,
                    location: location_1.name,
                    currentDateTime: foreCast.time.replace('T', ' ').replace(/-/g, '/'),
                    weather: __assign(__assign({}, foreCast), { condition: foreCast.condition, conditionImage: getWeatherCodeImage(foreCast.weathercode), lowestTemperature: foreCast.lowestTemperature, highestTemperature: foreCast.highestTemperature })
                });
                return [4 /*yield*/, response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered)];
            case 3:
                _a.sent();
                return [3 /*break*/, 6];
            case 4:
                error_1 = _a.sent();
                console.error(error_1);
                rendered = templates.render('home.njk', { environment: environment });
                return [4 /*yield*/, response.header('Content-Type', 'text/html; charset=UTF-8').send(rendered)];
            case 5:
                _a.sent();
                return [3 /*break*/, 6];
            case 6:
                ;
                return [2 /*return*/];
        }
    });
}); });
server.listen({ port: 3000 })
    .catch(function (error) {
    server.log.error(error);
    process.exit(1);
});
