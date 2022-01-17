//position finder extension

//to display the x and y of users mouse cursur
function position(action) {
  //if action is "show"...
  if (action === "show") {
    //create a div and add positions_container_ext to its id
    let positionsContainer = document.createElement("div");
    positionsContainer.id = "positions_container_ext";
    //inside the div, we have two p and a sapn in each of them to display x or y
    positionsContainer.innerHTML = `
      <p class="x_ext">x: <span class="x_place_ext">0</span></p>
      <p class="y_ext">y: <span class="y_place_ext">0</span></p>
      `;

    //create a style tag and add ext_styles to its id
    let styles = document.createElement("style");
    styles.id = "ext_styles";
    //all of the styles
    styles.innerHTML = `
      #positions_container_ext {
        font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        display: flex;
        margin: auto;
        background-color: #1a1b1c;
        opacity: 0.9;
        border-radius: 7px;
        position: fixed;
        min-width: 150px;
        height: 30px;
        padding: 5px;
        justify-content: space-around;
        align-items: center;
        z-index: 99999999999999999;
        bottom: 5px;
        left: 5px;
      }
    
      .x_ext, .y_ext {
        color: #fff;
        padding: 0;
        margin: 0;
        font-size: 17px;
      }
      `;

    //insert the positions container at the first place of the body
    document.body.insertBefore(positionsContainer, document.body.children[0]);
    //append the styles to the documents head
    document.head.appendChild(styles);

    //to add a event handler, we should add it to the window obj so we can remove event listener later
    window.ext_mousemove_handler =
      //if window.ext_mousemove_handler is not empty, equal window.ext_mousemove_handler to itself
      //else equal it to event handler function
      window.ext_mousemove_handler ||
      function (e) {
        //change the text content of x_place_ext and y_place_ext to clientX and clientY
        document.querySelector(
          "#positions_container_ext .x_place_ext"
        ).textContent = e.clientX;

        document.querySelector(
          "#positions_container_ext .y_place_ext"
        ).textContent = e.clientY;
      };

    //add the event handler to html tag
    document
      .querySelector("html")
      .addEventListener("mousemove", window.ext_mousemove_handler);
    //if action === "remove" then...
  } else if (action === "remove") {
    //select the position container
    let positions = document.querySelector("#positions_container_ext");
    //remove that from dom
    positions.remove();
    //select the last index of styles of position container
    let positionsStyles = document.querySelectorAll("#ext_styles");
    positionsStyles = positionsStyles[positionsStyles.length - 1];
    //remove that
    positionsStyles.remove();
    //remove the event listener
    document
      .querySelector("html")
      .removeEventListener("mousemove", window.ext_mousemove_handler);
  }
}

//set the badge text of extension to off
chrome.action.setBadgeText({ text: "off" });
//set the badge background color to blue
chrome.action.setBadgeBackgroundColor({ color: "#807878" });
//when the extension get installed on users chrome app...
chrome.runtime.onInstalled.addListener(() => {
  //when the user opened chrome
  chrome.runtime.onStartup.addListener(() => {
    chrome.action.setBadgeText({ text: "off" });
    chrome.action.setBadgeBackgroundColor({ color: "#807878" });
  });
});

//when user clicked on extensions icon
chrome.action.onClicked.addListener(() => {
  //get the current tab that user is in. we need its id
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    //get the badge text of the current tab
    chrome.action.getBadgeText({ tabId: tabs[0].id }, (result) => {
      //if badge text is off...
      if (result === "off") {
        //set the badge text to on only for that tab
        chrome.action.setBadgeText({ text: "on", tabId: tabs[0].id });
        //set the badge background to blue only for that tab
        chrome.action.setBadgeBackgroundColor({
          color: "#4688F1",
          tabId: tabs[0].id,
        });
        //run position function for only the current dom, give "show" argument and run this for all iFrames too 
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id, allFrames: true },
          function: position,
          args: ["show"],
        });
        //if badge text is on...
      } else if (result === "on") {
        chrome.action.setBadgeText({ text: "off", tabId: tabs[0].id });
        chrome.action.setBadgeBackgroundColor({
          color: "#807878",
          tabId: tabs[0].id,
        });
        chrome.scripting.executeScript({
          target: { tabId: tabs[0].id, allFrames: true },
          function: position,
          args: ["remove"],
        });
      }
    });
  });
});
