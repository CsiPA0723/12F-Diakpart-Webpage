window.onscroll = function() { scrollFunction(); };

const getPostIds = "http://szechenyidiakpart.ddns.net:8080/getpostids";
//const getPostIds = "http://lvh.me:8080/getpostids";
//const getPostIds = "http://127.0.0.1:8080/getpostids";

const postUrl = "http://szechenyidiakpart.ddns.net:8080/post";
//const postUrl = "http://lvh.me:8080/post";
//const postUrl = "http://127.0.0.1:8080/post";

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
        var main = document.getElementById("main");
        main.innerHTML += data.html;
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