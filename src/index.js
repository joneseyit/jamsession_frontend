document.addEventListener("DOMContentLoaded", initPage)
const usersUrl = 'http://localhost:3000/api/v1/users'
const sessionsUrl = 'http://localhost:3000/api/v1/sessions'
const userSessionsUrl = 'http://localhost:3000/api/v1/user_sessions'
let toggleCreate = false
let toggleProfileStatus = false
let signedIn = true
let usersList = []



function initPage(){
  fetchSessions()
  fetchUsers()

}
// function logIn(){
//   let signIn = document.querySelector("#sign-in")
//
//   if (signedIn === false){
//     signIn.style.display = 'none'
//   }
//   else {
//     signIn.style.display = 'block'
//   }
// }

function fetchSessions(){
  fetch(sessionsUrl)
  .then(res => res.json())
  .then(json => json.forEach(renderSession))
  .then(addButtonsNListeners)
}

function addButtonsNListeners(){
  addEditListener()
  addJoinHandler()
  addCreateHandler()
  toggleProfileHandler()
  addDeleteButtonsYeah()
  addHomeListener()
}
function addHomeListener(){
  let home = document.querySelector("#home")
  home.addEventListener('click', renderHome)
}

function renderHome(event){
document.querySelector('#profile').nextElementSibling.innerHTML = ""
document.querySelector("#create-sesh").nextElementSibling.innerHTML = ""
}
function fetchUsers(){
  fetch(usersUrl)
  .then(res => res.json())
  .then(json => createUsers(json))
}

function createUsers(json){
  json["data"].forEach(function(user){
    let curUser = {id: user.id, name: user.attributes.name, username: user.attributes.username, bio: user.attributes.bio}
    usersList.push(curUser)
  })
}

function renderSession(session){
let sessionHtml = `
<div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
  <div class="card" style="width: 18rem">
      <div class="card-body" data-id="${session.id}" data-title="${session.title}" data-time="${session.time}" data-location="${session.location}"
      data-description="${session.description}">
        <h5 class="card-text" >Title: ${session.title}</h5>
        <p class="card-text" >Description: ${session.description}</p>
        <p class="card-text">Time: ${session.time}</p>
        <p class="card-text">Location: ${session.location}</p>
        <flash-message name="flash-fixed"></flash-message>
        <button class="join-sesh" >Join Sesh</button>
        <button class="edit-sesh" >Edit Sesh</button>
        <button class="delete-sesh" >Delete Sesh</button>
          <div class="edit-container">

          </div>
      </div>
    </div>
  </div>
  `
  document.querySelector(".card-group").innerHTML += sessionHtml


}

function addJoinHandler(){
  let btns = document.querySelectorAll(".join-sesh")
  btns.forEach(function(button){
  button.addEventListener('click', processJoinSession)
  })

}

function processJoinSession(event){
  event.preventDefault()
  window.alert("You joined a sesh.  Bam!")
  let userId = "1"
  let sessionId = event.target.parentNode.dataset.id
  let request = new Request(userSessionsUrl)
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        user_id: userId,
        session_id: sessionId
    })
  }
  return fetch(request, options)

// Flash.create('success', 'You joined this jam sesh :)', 5000, {container: 'flash-fixed'})
//
}

function addEditListener(){
  let btns = document.querySelectorAll(".edit-sesh")
  btns.forEach(function(button){
    button.addEventListener('click', showEditForm)
  })
}

function showEditForm(event){

  event.preventDefault()
  let id = event.target.parentNode.dataset.id
  let request = new Request(`${sessionsUrl}/${id}`)
  let editForm = event.target.nextElementSibling
  let title = event.target.parentNode.dataset.title
  let desc = event.target.parentNode.dataset.description
  let time = event.target.parentNode.dataset.time
  let location = event.target.parentNode.dataset.location
  editForm.innerHTML =
    `  <form id="edit-form-${id}">
          <input id="title" type="text" name="title" value="${title}"/>
          <textarea id="description" type="text" rows="9" name="description" >${desc}</textarea>
          <input id="time" type="text" name="time" value=${time}/>
          <input id="location" type="text" name="location" value="${location}">
          <input type="submit" value="Submit"/>
        </form>
    `

    let form = document.querySelector(`#edit-form-${id}`)
    form.addEventListener('submit', processEditForm)
}

function processEditForm(event){
  event.preventDefault()
  let id = event.target.parentNode.parentNode.dataset.id
  let title = event.target.title.value
  let description = event.target.description.value
  let time = event.target.time.value
  // let request = new Request(`${sessionsUrl}/${id}`)
  let options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      description: description,
      time: time
    })
  }
  fetch(`${sessionsUrl}/${id}`, options)
  document.querySelector(`#edit-form-${id}`).style.display = 'none'
}
//refactor to include all navv bar function
function addCreateHandler(){
  let createButton = document.querySelector("#create-sesh")
  createButton.addEventListener('click', toggleSeshForm)
}

function toggleSeshForm(e){
  e.preventDefault()
  let container = e.target.nextElementSibling
  if(toggleCreate === false){
  container.innerHTML =   `
    <form id="create-form">
      <input type="text" name="title" placeholder="Title">
      <input type="textarea" name="description" placeholder="Gimme the deets.">
      <input type="datetime-local" id="session-time"
       name="time">
      <input type="text" name="location" placeholder="Location">
      <input  type="submit" value="Jam Away"/>
    </form>
    `
     document.querySelector("#create-form").addEventListener('submit', createSesh)
  } else {
    container.innerHTML = ""
  }
  toggleCreate = !toggleCreate


}

function createSesh(e){
  debugger
  e.preventDefault()
  let title = e.target.title.value
  let description = e.target.description.value
  let time = e.target.time.value
  let location = e.target.location.value

  let request = new Request(sessionsUrl)
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: title,
      description: description,
      time: time,
      location: location
    })
  }

  fetch(request, options)
document.querySelector("#create-sesh").nextElementSibling.innerHTML = "You made a jam sesh.  Nice."
}

function toggleProfileHandler(){
  let profile = document.querySelector('#profile')
  profile.addEventListener('click', toggleProfile)
}

function toggleProfile(e){
  e.preventDefault()
  let user = usersList.find(k => k.username === "Ymir Man")
  let container = document.querySelector('#profile').nextElementSibling
  if(toggleProfileStatus === false){
    container.innerHTML = `
    <div class="card">
      <div class="card-body">
        <h5 class="h4">Name: ${user.name}</h5>
        <h5 class="h4">Username: ${user.username}</h5>
        <p><strong>Bio:</strong> ${user.bio} </p>
      </div>
    </div>
    `
  } else {
    container.innerHTML = ""
  }
  toggleProfileStatus = !toggleProfileStatus
}

function addDeleteButtonsYeah(){
  let buttons = document.querySelectorAll(".delete-sesh")
  buttons.forEach(button => button.addEventListener('click', processDeleteButton))
}

function processDeleteButton(e){
  e.preventDefault()
  let id = e.target.parentNode.dataset.id
  e.target.parentNode.remove()
  let options = {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  }
  fetch(`http://localhost:3000/api/v1/sessions/${id}`, options)
}
