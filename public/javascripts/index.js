window.onscroll = function() { scrollFunction(); };

var loadedPosts = 0;
var loadedLastPost = false;
var finishedInit = false;
var finishedLoadingPost = false;

$(function() {
    const url = "http://szechenyidiakpart.ddns.net:8080/getlastpost";
    const urldev = "http://lvh.me:8080/getlastpost";
    $.ajax({
        type: 'GET',
        url: url,
        async: true,
        timeout: 5000,
        success: function (data) {
            onSuccess(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('error ' + textStatus + " " + errorThrown);
        }
    });

    function onSuccess(data) {
        console.log("onSucces data: ", data);
        if(data.id == -1) return;

        loadedPosts = data.id;
        console.log("loadedPosts:", loadedPosts);

        var main = document.getElementById("main");
        main.innerHTML = "";
        var postsToBeLoaded = loadedPosts - 3;
        for(let i = loadedPosts; i > postsToBeLoaded; i--) {
            LoadPost(i);
            sleep(10);
        }   
    
        finishedInit = true;
    }
});

function scrollFunction() {
    var goToTopButton = document.getElementById("goToTopButton");
    if(document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        goToTopButton.style.display = "block";
    } else {
        goToTopButton.style.display = "none";
    }
    //console.log(`scrTop: ${$(window).scrollTop()}\nheight: ${$(window).height()}\ndoc.height: ${$(document).height()}`);
    if(document.readyState == "complete" && finishedInit && finishedLoadingPost) {
        if($(window).scrollTop() + $(window).height() > $(document).height() - 100 && !loadedLastPost) {
            console.log("loading post from scrolling");
            LoadPost(loadedPosts);
        } 
    }
    
}

function LoadPost(id) {
    finishedLoadingPost = false;
    const url = "http://szechenyidiakpart.ddns.net:8080/post";
    const urldev = "http://lvh.me:8080/post";

    var data = {
        id: id
    };

    console.log("loadpost data id: ", data);

    $.ajax({
        type: 'POST',
        url: url,
        async: true,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            onSuccess(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('error ' + textStatus + " " + errorThrown);
        }
    });

    function onSuccess(data) {
        console.log("loadPost onSuccess data: ", data);
        if(data.id == -1) return;

        var main = document.getElementById("main");
        main.innerHTML += `
            <article id="post_${data.id}" class="card">
                <h2>${data.title}</h2>
                <h5>${data.title_desc}, ${data.date}</h5>
                <p>${data.post_text.replace(/\r\n/g, "<br>")}</p>
            </article>
        `;
        if(loadedPosts > 0) loadedPosts--;
        else if(loadedPosts == 0) loadedLastPost = true;
        finishedLoadingPost = true;
        console.log("loadedPosts", loadedPosts);
    }
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for(let i = 0; i < 1e7; i++) {
        if((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}