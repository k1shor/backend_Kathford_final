exports.hello = (request, response) => {
    response.json({message: "Good Morning"})
}

exports.hello2 = (request, response) => {
    response.send("Hi there")
}


