import React, {
  useEffect,
  useState
} from "react";

import Navbar from "../components/Navbar";

import "../css/Chat.css";


function Chat() {

  const [message, setMessage] =
    useState("");


  const [messages, setMessages] =
    useState([]);


  const [loading, setLoading] =
    useState(false);

  const user = JSON.parse(
  localStorage.getItem("user")
);

const userId =
  user.id;

  // ========================================
  // LOAD PREVIOUS MESSAGES
  // ========================================

  useEffect(() => {

    getMessages();

  }, []);



  // ========================================
  // GET MESSAGES FROM FASTAPI
  // ========================================

  const getMessages =
    async () => {

      try {

        const response =
          await fetch(
            `http://localhost:5050/api/messages/${userId}`
          );


        const data =
          await response.json();


        setMessages(
          data
        );


      } catch (error) {

        console.error(
          error
        );

      }

    };



  // ========================================
  // SEND MESSAGE
  // ========================================

  const sendMessage =
    async () => {


      if (
        message.trim() === "" ||
        loading
      ) {

        return;

      }



      const userText =
        message;


      const userMessage = {

        sender: "user",

        text: userText

      };



      // Show user message immediately

      setMessages(
        previousMessages => [

          ...previousMessages,

          userMessage

        ]
      );



      setMessage("");

      setLoading(true);



      try {


        // ====================================
        // SEND USER MESSAGE TO FASTAPI
        // ====================================

        const response =
          await fetch(

            "http://localhost:5050/api/chat",

            {

              method: "POST",


              headers: {

                "Content-Type":
                  "application/json"

              },


              body: JSON.stringify({
                sender: "user",
                user_id: userId,
                message:
                  userText

              })

            }

          );



        const data =
          await response.json();



        if (!response.ok) {

          throw new Error(
            data.detail
          );

        }



        // ====================================
        // CREATE AI MESSAGE
        // ====================================

        const aiMessage = {

          sender: "ai",

          text: data.answer

        };



        // ====================================
        // DISPLAY AI MESSAGE
        // ====================================

        setMessages(
          previousMessages => [

            ...previousMessages,

            aiMessage

          ]
        );


      } catch (error) {


        console.error(
          error
        );


        setMessages(
          previousMessages => [

            ...previousMessages,

            {

              sender: "ai",

              text:
                "Sorry, I could not generate a response."

            }

          ]
        );


      } finally {


        setLoading(
          false
        );

      }

    };



  // ========================================
  // ENTER KEY
  // ========================================

  const handleKeyDown =
    event => {


      if (
        event.key === "Enter"
      ) {

        sendMessage();

      }

    };



  // ========================================
  // DELETE CONVERSATION
  // ========================================

  const clearChat =
    async () => {


      try {


        await fetch(

          `http://localhost:5050/api/messages/${userId}`,

          {

            method: "DELETE"

          }

        );


        setMessages([]);


      } catch (error) {


        console.error(
          error
        );


      }

    };



  return (

    <div className="chat-page">


      <Navbar />


      <div className="chat-container">


        {/* =================================
            HEADER
        ================================= */}


        <div className="chat-header">


          <div>


            <span className="chat-small-title">

              AI ASSISTANT

            </span>


            <h1>

              Business AI Chat

            </h1>


            <p>

              Ask questions about your
              business and receive
              AI-powered answers.

            </p>


          </div>



          <div className="chat-header-actions">


            <button
              className="clear-chat-button"
              onClick={clearChat}
            >

              Clear Chat

            </button>



            <div className="ai-status">


              <span
                className="status-dot"
              ></span>


              AI Agent Online


            </div>


          </div>


        </div>



        {/* =================================
            CHAT CARD
        ================================= */}


        <div className="chat-card">


          {/* =================================
              MESSAGES
          ================================= */}


          <div className="messages-container">


            {messages.length === 0 && (

              <div className="message-row ai-row">


                <div className="message-avatar ai-avatar">

                  AI

                </div>


                <div className="message-bubble ai-message">

                  Hello! I am your AI Business
                  Assistant. Ask me anything
                  about business.

                </div>


              </div>

            )}



            {messages.map(
              (item, index) => (

                <div

                  key={index}

                  className={

                    item.sender === "user"

                      ? "message-row user-row"

                      : "message-row ai-row"

                  }

                >



                  {item.sender === "ai" && (

                    <div
                      className="
                        message-avatar
                        ai-avatar
                      "
                    >

                      AI

                    </div>

                  )}



                  <div

                    className={

                      item.sender === "user"

                        ? "message-bubble user-message"

                        : "message-bubble ai-message"

                    }

                  >

                    {item.text}

                  </div>



                  {item.sender === "user" && (

                    <div
                      className="
                        message-avatar
                        user-avatar
                      "
                    >

                      J

                    </div>

                  )}


                </div>

              )
            )}



            {/* =================================
                THINKING
            ================================= */}


            {loading && (

              <div className="message-row ai-row">


                <div className="message-avatar ai-avatar">

                  AI

                </div>


                <div className="message-bubble ai-message">

                  Thinking...

                </div>


              </div>

            )}


          </div>



          {/* =================================
              SUGGESTIONS
          ================================= */}


          <div className="suggestions">


            <button

              onClick={() =>
                setMessage(
                  "How can I increase my business sales?"
                )
              }

            >

              Increase sales

            </button>



            <button

              onClick={() =>
                setMessage(
                  "How can I improve customer retention?"
                )
              }

            >

              Customer retention

            </button>



            <button

              onClick={() =>
                setMessage(
                  "How can AI help my business?"
                )
              }

            >

              How can AI help?

            </button>


          </div>



          {/* =================================
              INPUT
          ================================= */}


          <div className="chat-input-wrapper">


            <input

              type="text"

              placeholder="Ask anything about your business..."

              value={message}

              onChange={
                event =>
                  setMessage(
                    event.target.value
                  )
              }

              onKeyDown={
                handleKeyDown
              }

              disabled={
                loading
              }

            />



            <button

              className="send-button"

              onClick={
                sendMessage
              }

              disabled={
                loading
              }

            >

              ➤

            </button>


          </div>


          <p className="chat-note">

            Powered by OpenAI

          </p>


        </div>


      </div>


    </div>

  );

}


export default Chat;