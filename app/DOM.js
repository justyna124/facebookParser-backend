const JSDOM = require('jsdom').JSDOM;

var Post = class Post {

    constructor(id, author, date, content) {
        this.id = id;
        this.author = author;
        this.date = date;
        this.content = content;
    }
};

function postList(dom) {

    const jsdom = new JSDOM(dom);
    const {window} = jsdom;
    console.log(dom);
    var len = jsdom.window.document.querySelectorAll(".userContent").length;
    var list = [];


    for (let i = 0; i < len; i++) {

        var id = jsdom.window.document.querySelectorAll("._3ccb")[i].getAttribute('id');
        var author = jsdom.window.document.querySelectorAll(".fwn .fcg")[i].textContent;
        var content = jsdom.window.document.querySelectorAll(".userContent")[i].textContent;
        var date = jsdom.window.document.querySelectorAll('abbr._5ptz')[i].getAttribute('title');
        let post = new Post(id, author, date, content);
        list.push(post);
    }
    return list;
}

module.exports = postList;