const { ResponseTemplate } = require("../helper/template.helper");
const jwt = require("jsonwebtoken");

async function Authenticate(req, res, next) {
    const { authorization } = req.headers;

    if (!authorization) {
        let respons = ResponseTemplate(null, "user unauthorized", null, 401);
        res.status(401).json(respons);
        return;
    }

    try {
        const user = await jwt.verify(authorization, process.env.SECRET_KEY);
        req.user = user;
        next();
    } catch (error) {
        let respons = ResponseTemplate(null, "user unauthorized", error, 400);
        res.status(400).json(respons);
        return;
    }
}

async function restrictPostTodos(req, res, next) {
    const { authorization } = req.headers;
    const { email } = req.params;

    try {
        const user = await jwt.verify(authorization, process.env.SECRET_KEY);
        const idFromToken = user.id;
        const idFromBody = Number(req.body.userId);

        // console.log(idFromToken)
        // console.log(idFromBody)

        if (idFromToken !== idFromBody) {
            let respons = ResponseTemplate(
                null,
                "Forbidden: Access denied",
                error,
                400,
            );
            return res.status(400).json(respons);
            // console.log(req.params.email);
        }
        next();
    } catch (error) {
        let respons = ResponseTemplate(
            null,
            "Forbidden: Access denied",
            error,
            400,
        );
        res.status(400).json(respons);
        return;
    }
}

module.exports = {
    Authenticate,
    restrictPostTodos,
};
