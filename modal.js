const toggleElement = elem => {
    if(elem.getAttribute("class").indexOf("hidden") !== -1) {
        elem.setAttribute("class",
            elem.getAttribute("class").replace("hidden", "").trim()
        );
    } else {
        elem.setAttribute("class",
            "hidden " + elem.getAttribute("class").trim()
        );
    }
}