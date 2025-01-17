import React from "react";
import "./Mision.css";
import { Link } from "react-router-dom";
import Popup from "reactjs-popup";

const Mision = props => {
  const deleteQuest = () => {
    fetch("/quests/" + props.info._id, {
      method: "DELETE"
    });
  };
  let add = false;
  const updateQuest = () => {
    if (add) {
      props.info.players.push(props.currentUser._id);
    } else {
      props.info.players.splice(
        props.info.players.findIndex(id => id === props.currentUser._id),
        1
      );
    }
    fetch("/quests/" + props.info._id, {
      method: "PUT",
      body: JSON.stringify({
        name: props.info.name,
        description: props.info.description,
        startDate: props.info.startDate,
        finishDate: props.info.finishDate,
        minPlayers: props.info.minPlayers,
        maxPlayers: props.info.maxPlayers,
        completed: props.info.completed,
        owner: props.info.owner,
        players: props.info.players,
        game: props.info.game
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });

    updateChat();
  };
  var chatId="";
  const updateChat = () => {
    const users=[]

    props.info.players.map((player) => {
      users.push({user_id:player, user_name:"default"});
    });

    users.push({user_id:props.info.owner, user_name:"default"});

    if(props.info.players.length+1===props.info.maxPlayers) {
      console.log("chat creation");
      fetch("/chats", {
      method: "POST", // or 'PUT'
      body: JSON.stringify({
        name: props.info.name,
        quest: props.info._id,
        users: users,
        messages: [],
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .catch(error => console.error("Error:", error))
      .then(response => {console.log("Success:", response); chatId="something"});
    }

    if (chatId!==""&&!add) {
      
    }
  };

  const setButtons = () => {
    if(props.currentUser) {    
      if (props.info.owner === props.currentUser._id) {
          return (
            <button className="btn-eliminar" onClick={deleteQuest}>
              Eliminar
            </button>
          );
        } else if (
          props.info.players.findIndex(id => id === props.currentUser._id) >= 0
        ) {
          add = false;
          return (
            <button className="btn-rechazar" onClick={updateQuest}>
              Rechazar
            </button>
          );
        } else if(props.info.players.length+1!==props.info.maxPlayers) {
          add = true;
          return (
            <button className="btn-unirse" onClick={updateQuest}>
              Unirse
            </button>
          );
        }
    }
  };

  const renderPlayers = () => {
    return props.info.players.map((player, i) => {
        return (
          <li key={i}>{player}</li>
        );
    });
  };

  return (
    <div className="Mision">
      <div className="container-fluid mision">
        <div className="row nombre">
          <div className="col-md-10">
            {props.info.name}
          </div>
          {props.currentUser && props.info.players.length+1===props.info.maxPlayers
            ? 
            (props.info.players.findIndex(id => id === props.currentUser._id) >= 0 
            ?
              (<div className="col-md-2">
                <Link to="chats">
                  <img
                    src="../chat.png"
                    alt="Chat logo"
                    className="quest-info-logo"
                  />
                </Link>
              </div>
              ) : (
              ""
            )): ("")
        }
        </div>
        <div className="row descripcion">
          <p>{props.info.description}</p>
        </div>
        <div className="row jugadores">
          {props.info.players.length + 1} / {props.info.maxPlayers} jugadores
        </div>
        <div className="row botones">
          {setButtons()}
        </div>
      </div>
    </div>
  );
};

export default Mision;
