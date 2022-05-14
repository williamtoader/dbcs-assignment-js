import {contentGenerator} from "./contentgenerator.js";
import {parseLinkHeader} from "./parseLinkHeader.js";

export const userApiConnector = {
    allUsers: () => fetch("https://jsonplaceholder.typicode.com/users", {
        mode: "cors"
    })
        .then((response) => response.json()),
    user: (id) => fetch(`https://jsonplaceholder.typicode.com/users?id=${id}`, {
        mode: "cors"
    })
        .then((response) => response.json())
}


export const postsApiConnector = {
    allPosts: async (page, limit, user = null) => fetch(
        user ?
            `https://jsonplaceholder.typicode.com/posts?userId=${user}` :
            `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${limit}&_sort=id&_order=desc`,
        {
                mode: "cors"
        }
    )
        .then((response) => {
            return {
                body: response.json(),
                link: user ? null : parseLinkHeader(response.headers.get("Link")),
                totalPages:
                    Math.ceil(Number(response.headers.get("x-total-count")) / limit)
            };
        }),
    postsByUser: async (userId) => fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`, {
        mode: "cors"
    })
        .then((response) => response.json()),
    generateImageTag: (width, height) =>
        `<img src="https://picsum.photos/${width}/${height}?dummy=${Math.floor(Math.random() * 100000)}" class="hero-image" alt="Random image"/>`,
    generateLoremIpsum: (paragraphNo) => mIpsum({ pNum: paragraphNo }),
    addPost: (title, body, user) => {
        fetch('https://jsonplaceholder.typicode.com/posts/', {
            method: 'POST',
            body: JSON.stringify({
                title: title,
                body: body,
                userId: user,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
        })
            .then((response) => response.json())
            .then(async (post_data) =>{
                const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                document.getElementById("content").innerHTML = contentGenerator.generatePost({
                    title: post_data.title,
                    author: (await userApiConnector.user(post_data.userId))[0].name,
                    subtitle: `Post no. ${post_data.id}`,
                    date: new Date().toLocaleString(options),
                    image: postsApiConnector.generateImageTag(1920,1080),
                    content: post_data.body
                }) + document.getElementById("content").innerHTML;
            });
    }
};

let currentUserFilter = null;
let page = 1;
const loadApp = () => {
    console.log(page);
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    postsApiConnector.allPosts(page, 3, currentUserFilter).then(({body, link, totalPages})=>{
        body.then(async (data) => {
            let post_data;
            document.getElementById("content").innerHTML = "";
            for(post_data of data) {
                document.getElementById("content").innerHTML += contentGenerator.generatePost({
                    title: post_data.title,
                    author: (await userApiConnector.user(post_data.userId))[0].name,
                    subtitle: `Post no. ${post_data.id}`,
                    date: new Date().toLocaleString(options),
                    image: postsApiConnector.generateImageTag(1920,1080),
                    content: "Response content: " + post_data.body + "<br>" + postsApiConnector.generateLoremIpsum(5)
                });
            }
            document.getElementById('btnPageNext').addEventListener('click', function(eventObj) {
                if(page < totalPages) {
                    page++;
                    loadApp();
                }
                eventObj.target.replaceWith(eventObj.target.cloneNode(true));
                eventObj.stopImmediatePropagation();
            });
            document.getElementById('btnPagePrev').addEventListener('click', function(eventObj) {
                if(page > 1) {
                    page--;
                    loadApp();
                }
                eventObj.target.replaceWith(eventObj.target.cloneNode(true));
                eventObj.stopImmediatePropagation();
            });
            if(currentUserFilter != null) {
                document.getElementById('btnPagePrev').replaceWith(
                    document.getElementById('btnPagePrev').cloneNode(true)
                );
                document.getElementById('btnPageNext').replaceWith(
                    document.getElementById('btnPageNext').cloneNode(true)
                );
            }
        });

    });


}

export const setUserFilter = (user) => {
    currentUserFilter = user;
    page = 1;
    loadApp();
}

document.addEventListener("DOMContentLoaded", function(event) {
    const selectElem = document.getElementById("userFilterSelect");
    const modalSelectElement = document.getElementById("userSelectPost");
    userApiConnector.allUsers().then(users => {
        let user;
        for(user of users) {
            selectElem.innerHTML += `<option value="${user.id}">${user.name}</option>`;
            modalSelectElement.innerHTML += `<option value="${user.id}">${user.name}</option>`;
        }

        loadSelect((text, val) => {
            if(Number(val) !== 0) {
                setUserFilter(Number(val));
            }
            else setUserFilter(null);
        });
    });

    document.getElementById("btnAddArticle").addEventListener("click", e => {
        toggleElement(document.getElementById("addPostModal"));
    });

    document.getElementById("subject").value = postsApiConnector.generateLoremIpsum(5);

    document.getElementById("addPostForm").onsubmit = e => {
        const formData = new FormData(e.target);
        e.preventDefault();
        console.log(formData);
        postsApiConnector.addPost(
            formData.get("title"),
            formData.get("subject"),
            Number(formData.get("user"))
        );
    };

    page = 1;
    loadApp();

    window.p = postsApiConnector;
    window.setUserFilter = setUserFilter;
    window.u = userApiConnector;
});
