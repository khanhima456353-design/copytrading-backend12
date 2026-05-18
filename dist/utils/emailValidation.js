"use strict";
const allowedDomains = [
    "gmail.com",
    "outlook.com",
    "hotmail.com",
    "yahoo.com",
    "icloud.com",
    "proton.me",
    "protonmail.com",
    "tutanota.com",
    "startmail.com",
    "mailfence.com",
    "zoho.com",
    "fastmail.com",
    "amazon.com",
    "aol.com",
    "gmx.com",
    "yandex.com",
    "rediffmail.com"
];
const isValidEmailFormat = (email) => {
    if (!email)
        return false;
    const cleanEmail = email.trim().toLowerCase();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(cleanEmail);
};
module.exports = { isValidEmailFormat };
