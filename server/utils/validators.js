module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword,
    name
) => {
    const errors = {}
    if (name.trim() === "") {
        errors.name = "Name must not be empty"
    }
    if (username.trim() === "") {
        errors.username = "Username must not be empty"
    }
    if (email.trim() === "") {
        errors.email = "Email must not be empty"
    }
    else {
        const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!email.match(emailRegEx)) {
            errors.email = "Email must be a valid email address"
        }
    }
    if (password === "") {
        errors.password = "Password must not be empty"
    }
    else if (password !== confirmPassword) {
        errors.password = "Password must match"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}


module.exports.validateLoginInput = (username, password) => {
    const errors = {}
    if (username.trim() === "") {
        errors.username = "Username must not be empty"
    }
    if (password === "") {
        errors.password = "Password must not be empty"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateUsernameAndEmail = (username, email) => {
    const errors = {}
    if (username.trim() === "") {
        errors.username = "Username must not be empty"
    }
    if (email.trim() === "") {
        errors.email = "Email must not be empty"
    }
    else {
        const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        if (!email.match(emailRegEx)) {
            errors.email = "Email must be a valid email address"
        }
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validatePassword = (password, confirmPassword) => {
    const errors = {}

    if (password === "") {
        errors.password = "Password must not be empty"
    }
    else if (password !== confirmPassword) {
        errors.password = "Password must match"
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validatePost = (body, imagePath) => {
    const errors = {}

    if (body.trim() === "") {
        errors.body = "Body must not be empty"
    }

    if (imagePath) {
        var index = imagePath.indexOf("/")
        var index2 = imagePath.indexOf(";")
        var fileExt = imagePath.slice((index + 1), index2).trim()

        if (fileExt !== "jpg" && fileExt !== "jpeg" && fileExt !== "png") {
            errors.image = "File must be an image"
        }
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}