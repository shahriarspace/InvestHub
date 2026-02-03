// User types
export var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["STARTUP"] = "STARTUP";
    UserRole["INVESTOR"] = "INVESTOR";
})(UserRole || (UserRole = {}));
export var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIVE"] = "ACTIVE";
    UserStatus["INACTIVE"] = "INACTIVE";
    UserStatus["DELETED"] = "DELETED";
})(UserStatus || (UserStatus = {}));
// Startup types
export var StartupStatus;
(function (StartupStatus) {
    StartupStatus["DRAFT"] = "DRAFT";
    StartupStatus["PUBLISHED"] = "PUBLISHED";
    StartupStatus["ARCHIVED"] = "ARCHIVED";
})(StartupStatus || (StartupStatus = {}));
// Investor types
export var InvestorStatus;
(function (InvestorStatus) {
    InvestorStatus["ACTIVE"] = "ACTIVE";
    InvestorStatus["INACTIVE"] = "INACTIVE";
    InvestorStatus["SUSPENDED"] = "SUSPENDED";
})(InvestorStatus || (InvestorStatus = {}));
// Investment Offer types
export var OfferStatus;
(function (OfferStatus) {
    OfferStatus["PENDING"] = "PENDING";
    OfferStatus["ACCEPTED"] = "ACCEPTED";
    OfferStatus["REJECTED"] = "REJECTED";
    OfferStatus["EXPIRED"] = "EXPIRED";
})(OfferStatus || (OfferStatus = {}));
