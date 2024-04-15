import bcrypt from "bcryptjs";

const password = "w2BC8U8Yiw2ELwz";

bcrypt.hash(password, 10).then((hash0) => {
    const hash = "$2a$10$tPAXAwOmbiVfm8gqr3E/mOAbfX6JBmroezHQ9lzgU9Ch9JB6Hbhva";
    console.log("hash", hash);

    bcrypt.compare(password, hash).then((bool) => console.log("bool", bool));
});
