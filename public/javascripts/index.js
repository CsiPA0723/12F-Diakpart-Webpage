window.onscroll = function() { scrollFunction(); };

var getPostIds = "http://szechenyidiakpart.ddns.net/getpostids";
var getPostIdsDev = "http://lvh.me/getpostids";
//var getPostIds = "http://127.0.0.1/getpostids";

var postUrl = "http://szechenyidiakpart.ddns.net/post";
var postUrlDev = "http://lvh.me/post";
//var postUrl = "http://127.0.0.1/post";

var origin = window.location.origin;
if(origin.includes("lvh.me")) {
    getPostIds = getPostIdsDev;
    postUrl = postUrlDev;
}

const URLReqExp = /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/g;

const youtubeRegExp = /(?:https?:\/\/)?(?:(?:(?:www\.?)?youtube\.com(?:\/(?:(?:watch\?.*?(v=[-_A-Za-z0-9]+))))?)|(?:youtu\.be(\/.*)?))/g;

const imgurPostRegExp = /(http|https)+(:\/\/)*(i\.imgur\.com\/)+(([a-z]|\d){7})+(\.)+(PNG|JPG|GIFV|GIF|APNG|TIFF|XCF|MOV|MP4)/ig;

const facebookRegExp = /http(?:s)?:\/\/(?:www\.|web\.|m\.)?facebook.com\/([\w\d]+)\/videos(?:\/[\w\d\.]+)?\/(\d+)(?:\/\?type=[\d]&theater)?(\/)?/g;

var loadedPostIndex = 0;
var loadedLastPost = false;
var finishedInit = false;
var finishedLoadingPost = false;
var ids = GetPostIds();

$(function() {
    if(document.URL.endsWith("szerv_felepites")) {
        finishedInit = true;
        return;
    }

    $.ajax({
        type: 'GET',
        url: getPostIds,
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
        loadedPostIndex = data.ids.length - 1;
        if(loadedPostIndex == -1) { loadedLastPost = true; return; }
        console.log("loadedPostIndex", loadedPostIndex);
        ids = data.ids;
        var main = document.getElementById("main");
        main.innerHTML = "";
        var postsToBeLoaded = data.ids.length - 3 - 1;
        if(postsToBeLoaded < 0) postsToBeLoaded = -1;
        for (let i = data.ids.length - 1; i > postsToBeLoaded; i--) {
            LoadPost(data.ids[i]);
            sleep(30);
        }
    
        finishedInit = true;
    }
    topFunction();
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
            LoadPost(ids[loadedPostIndex]);
        } 
    }
}

function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

function LoadPost(id) {
    finishedLoadingPost = false;

    console.log("PostIndex", loadedPostIndex);

    var data = { id: id };

    console.log("loadpost data id (value): ", data);

    $.ajax({
        type: 'POST',
        url: postUrl,
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
        if(data.id == -1)  {
            finishedLoadingPost = true;
            return;
        }
        console.log("post: ", data);
        var videos = "<br>";
        data.post_text = data.post_text.replace(/(\r\n)|(\n)/g, "<br>");
        data.post_text = data.post_text.replace(facebookRegExp, (match, p1, p2, offset, string) => {
            link = `<a href="${match}">${match}</a>`;

            var iframe = `<br><iframe src="https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2F${p1}%2Fvideos%2F${p2}%2F&show_text=0" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe>`;
            videos += iframe;
            return link;
        });
        data.post_text = data.post_text.replace(youtubeRegExp, (match, p1, p2, offset, string) => {
            link = `<a href="${match}">${match}</a>`;
            var iframe =`<br><iframe src="https://www.youtube.com/embed/${p1.slice(2)}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            videos += iframe;
            return link;
        });

        data.post_text = data.post_text.replace(imgurPostRegExp, (match, p1, p2, offset, string) => {
            var link = `<a href="${match}">${match}</a>`;
            var iframe =`<br><embed src="${match}" frameborder="0" allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>`;
            videos += iframe;
            return link;
        });

        data.post_text = data.post_text.replace(URLReqExp, "<a href='$&'>$&</a>");
        console.log("LINKED TEXT:\n", data.post_text);        
        console.log("VIDEOS TEXT:\n", videos);        
        var main = document.getElementById("main");
        main.innerHTML += `
            <article id="post_${data.id}">
                <h2>${data.title}</h2>
                <h5>${data.title_desc ? data.title_desc + ", " : ""}${data.date}</h5>
                <hr>
                <p>${data.post_text + videos}</p>
                <div class="buttons">
                    <input type="button" onclick="openEditingForm(${data.id});" value="Szerkeztés">
                    <input type="button" onclick="openDeletingForm(${data.id});" value="Törlés">
                </div>
            </article>`;
        if(finishedInit) loadedPostIndex--;
        if(loadedPostIndex < 0) loadedLastPost = true;
        finishedLoadingPost = true;
        console.log("Next: loadedPostIndex", loadedPostIndex);
    }
    
}

function GetPostIds() {
    var postIds = { ids: [] };
    $.ajax({
        type: 'GET',
        url: getPostIds,
        async: true,
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            postIds = data;
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('error ' + textStatus + " " + errorThrown);
        }
    });
    return postIds;
}

function EditPost(id) {
    var data = { id: id };

    console.log("editpost data id: ", data);

    $.ajax({
        type: 'POST',
        url: postUrl,
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
        if(data.id == -1) return;
        document.getElementById("ef_id").value = data.id;
        document.getElementById("ef_title").value = data.title;
        document.getElementById("ef_title_desc").value = data.title_desc;
        document.getElementById("ef_post_text").value = data.post_text;
        console.log("editPost successfull");
    }
}

function DeletePost(id) {
    var data = { id: id };

    console.log("deletepost data id: ", data);

    $.ajax({
        type: 'POST',
        url: postUrl,
        async: true,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(data),
        dataType: "json",
        timeout: 5000,
        success: function (data) {
            if(data.id == -1) return;
            document.getElementById("del_id").value = data.id;
            console.log("deletingPost successfull");
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error('error ' + textStatus + " " + errorThrown);
        }
    });
}

function sleep(milliseconds) {
    var start = new Date().getTime();
    for(let i = 0; i < 1e7; i++) {
        if((new Date().getTime() - start) > milliseconds){
            break;
        }
    }
}

var postingFormId = "postingForm";

function openPostingForm() {
    var postingForm = document.getElementById(postingFormId);
    fadeIn(postingForm);
}

function closePostingForm() {
    var postingForm = document.getElementById(postingFormId);
    fadeOut(postingForm);
}

var editingFormId = "editingForm";

function openEditingForm(id) {
    var editingForm = document.getElementById(editingFormId);

    EditPost(id);

    fadeIn(editingForm);
}

function closeEditingForm() {
    var editingForm = document.getElementById(editingFormId);
    fadeOut(editingForm);
}

var deletingFormId = "deletingForm";

function openDeletingForm(id) {
    var deletingForm = document.getElementById(deletingFormId);

    DeletePost(id);

    fadeIn(deletingForm);
}

function closeDeletingForm() {
    var deletingForm = document.getElementById(deletingFormId);
    fadeOut(deletingForm);
}

function fadeOut(el) {
    el.style.opacity = 1;
  
    (function fade() {
        if ((el.style.opacity -= 0.1) < 0) {
            el.style.display = "none";
        } else {
            requestAnimationFrame(fade);
        }
    })();
}
  
function fadeIn(el, display){
    el.style.opacity = 0;
    el.style.display = display || "block";
  
    (function fade() {
        var val = parseFloat(el.style.opacity);
        if (!((val += 0.1) > 1)) {
            el.style.opacity = val;
            requestAnimationFrame(fade);
        }
    })();
}