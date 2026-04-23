const roleMiddleware = (...allowedRoles) => {

    return (req, res, next) => {

        try {

            

            if (!req.user) {
                return res.status(401).json({
                    message: "User not found in request"
                })
            }

            const userRole = req.user.role;

            

            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({
                    message: "Access denied"
                })
            }

            next();

        } catch (error) {

            console.log("ROLE ERROR:", error.message);
            console.log("ERROR:", error)
            
            return res.status(500).json({
                message: "Server error"
            })
        }
    }
}

module.exports = roleMiddleware;