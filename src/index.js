document.addEventListener("DOMContentLoaded", initPage)
const usersUrl = 'http://localhost:3000/api/v1/users'
const sessionsUrl = 'http://localhost:3000/api/v1/sessions'
const userSessionsUrl = 'http://localhost:3000/api/v1/user_sessions'


function initPage(){
  fetchSessions()
}

function fetchSessions(){
  fetch(sessionsUrl)
  .then(res => res.json())
  .then(json => json.forEach(renderSession))
}

function renderSession(json){
  // debugger
let sessionHtml = `
<div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
  <div class="card" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-text">${json.title}</h5>
        <p class="card-text">${json.description}</p>
        <button class="join-sesh">Join Sesh</button>
      </div>
    </div>
  </div>
  `
  document.querySelector(".card-group").innerHTML += sessionHtml
}
