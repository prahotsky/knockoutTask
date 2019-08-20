let contributorsArr = []
let groupedArr = []
const apiLink =
    "https://api.github.com/repos/thomasdavis/backbonetutorials/contributors"
const apiUserLink = "https://api.github.com/users/"
const errorMsg = "Oops.. Some problems with connection"
let selectedBtn = "1"

function ContactsViewModel() {
    var self = this

    self.contacts = ko.observableArray([])
    self.errorMsg = ko.observable(false)
    getContacts()
        .then(response => response.json())
        .then(data => self.contacts(data))
        .catch(() => {
            showErrMsg()
        })
}

// var viewModel = {
//     showErrMsg: ko.observable(false),
//     contacts: ko.observableArray([])
// }

function getContacts() {
    return fetch(apiLink)
}
// fetch(apiLink)
//     .then(res => res.json())
//     .then(data => {
//         contributorsArr = data
//         groupedArr = data
//         sortData()
//         console.log(data)
//         showItems(data)
//     })
//     .catch(() => {
//         showErrMsg()
//     })

function showErrMsg(parent) {
    viewModel.showErrMsg(true)
}

function showItems(data) {
    $("#mainItemWrapper").empty()
    data.forEach(item => {
        let $avatar = $("<img>")
            .addClass("avatar")
            .attr("src", item.avatar_url)
        let $login = $("<p></p>").html(item.login)
        let $contributions = $("<p></p>").html(
            "Contributions: " + item.contributions
        )
        let $caption = $("<div></div>")
            .addClass("caption")
            .append($login)
            .append($contributions)
        let $contactCard = $("<div></div>")
            .addClass("main-item")
            .append($avatar)
            .append($caption)
        $("#mainItemWrapper")
            .append($contactCard)
            .fadeIn(300)
    })
}

function listenSelect() {
    $("#selectContainer").on("click", event => {
        activateBtn(event.target)
    })
}

function activateBtn(target) {
    ;[].forEach.call($("#selectContainer").children(), item => {
        item.className = "btn-wrapper"
    })
    while (target != $("#selectContainer")) {
        if (target.className === "btn-wrapper") {
            target.classList.add("btn-active")
            groupingContributors(target)
            return
        }
        target = target.parentNode
    }
}

function groupingContributors(target) {
    if (selectedBtn === target.id) {
        return
    }
    selectedBtn = target.id
    switch (target.id) {
        case "1":
            groupedArr = contributorsArr
            sortData()
            showItems(groupedArr)
            break
        case "2":
            groupedArr = contributorsArr.filter(item => item.contributions > 10)
            sortData()
            showItems(groupedArr)
            break
        case "3":
            groupedArr = contributorsArr.filter(
                item => item.contributions >= 2 && item.contributions <= 10
            )
            sortData()
            showItems(groupedArr)
            break
        case "4":
            groupedArr = contributorsArr.filter(
                item => item.contributions >= 1 && item.contributions < 2
            )
            sortData()
            showItems(groupedArr)
            break
    }
}

function listenSort() {
    $("#sortBtn").on("click", () => {
        alphabeticallySorted = !alphabeticallySorted
        sortData()
    })
}

let alphabeticallySorted = true

function sortData() {
    document.getElementById("mainItemWrapper").style.display = "none"
    if (!alphabeticallySorted) {
        groupedArr.sort((a, b) => {
            if (a.login.toLowerCase() < b.login.toLowerCase()) return 1
            if (a.login.toLowerCase() > b.login.toLowerCase()) return -1
        })
    } else if (alphabeticallySorted) {
        groupedArr.sort((a, b) => {
            if (a.login.toLowerCase() > b.login.toLowerCase()) return 1
            if (a.login.toLowerCase() < b.login.toLowerCase()) return -1
        })
    }
    reverseSortBtn()
    showItems(groupedArr)
}

function reverseSortBtn() {
    if (alphabeticallySorted) {
        $("#sortBtn").attr("src", "resources/sort.png")
    }
    if (!alphabeticallySorted) {
        $("#sortBtn").attr("src", "resources/reverse-sort.png")
    }
}

function listenItems() {
    $("#mainItemWrapper").on("click", event => {
        getItem(event.target)
    })
}

function getItem(target) {
    while (target != $("#mainItemWrapper")[0]) {
        if (target.className === "main-item") {
            getMoreInfo(target.lastChild.firstChild.innerText)
            return
        }
        target = target.parentNode
    }
}

function getMoreInfo(name) {
    $.get(apiUserLink + name, data => {
        showPopUp(data)
    }).fail(function(jqXHR, textStatus, errorThrown) {
        console.log(jqXHR)
        console.log(textStatus)
        console.log(errorThrown)
        showPopUp([])
        showErrMsg($(".pop-up"))
    })
}

function showPopUp(data) {
    $("#popUpWrapper").empty()
    let $avatar
    if (data.avatar_url) {
        $avatar = $("<img>")
            .addClass("pop-up-avatar")
            .attr("src", data.avatar_url)
    }
    let $closeTab = $("<img>")
        .addClass("close-tab")
        .attr("src", "resources/close.png")
    let $login
    if (data.login) {
        $login = $("<p></p>").html(data.login)
    }
    let $name
    if (data.name) {
        $name = $("<p></p>").html("Name: " + data.name)
    }
    let $company
    if (data.company) {
        $company = $("<p></p>").html("Company: " + data.company)
    }
    let $location
    if (data.location) {
        $location = $("<p></p>").html("Location: " + data.location)
    }
    let $email
    if (data.email) {
        $email = $("<p></p>").html("E-mail: " + data.email)
    }
    let $popUpInfo = $("<div></div>")
        .addClass("pop-up-info")
        .append($login)
        .append($name)
        .append($company)
        .append($location)
        .append($email)
    let $popUp = $("<div></div>")
        .addClass("pop-up")
        .append($avatar)
        .append($closeTab)
        .append($popUpInfo)
    $("#popUpWrapper")
        .append($popUp)
        .fadeIn(200)
    listenClosePopup()
}

function listenClosePopup() {
    $("#popUpWrapper").on("click", event => {
        if (event.target.id === "popUpWrapper") {
            closePopUp()
        }
    })
    $(".close-tab").on("click", () => {
        closePopUp()
    })
}

function closePopUp() {
    $("#popUpWrapper").fadeOut(200)
}

listenSelect()
listenSort()
listenItems()

ko.applyBindings(new ContactsViewModel())
