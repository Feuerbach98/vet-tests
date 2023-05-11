import './App.css';
import {text} from "./text";
import {useEffect, useState} from "react";
import {text2} from "./text2";

const obj = [];

(function parseData() {
  let newText = text.concat(text2)
    .split("Завдання №")
    .filter((el) => el !== "" && el !== "\n")
    .map((el) => el.replaceAll("*", ""));
  newText.forEach((el, i) => {
    //question number
    const index = i;

    //answers
    obj[index] = {};
    obj[index]["answers"] = [];
    const answers = el.split("А. ")[1].split("--")[0];
    obj[index]["answers"][0] = {
      letter: "А",
      value: answers.split("Б.")[0].trim()
    }
    obj[index]["answers"][1] = {
      letter: "Б",
      value: answers.split("Б.")[1].split("В.")[0].trim()
    }
    obj[index]["answers"][2] = {
      letter: "В",
      value: answers.split("В.")[1].split("Г.")[0].trim()
    }
    obj[index]["answers"][3] = {
      letter: "Г",
      value: answers.split("Г.")[1].trim()
    }

    //get question text
    const question = el.split("А. ")[0].split('\n')[1]
    obj[index]["question"] = question;

    //get question answer
    let answer;
    if (el.includes("Правильна відповідь -- ")) {
      answer = el.split("Правильна відповідь -- ")[1][0]
    } else {
      answer = el.split("Правильна відповідь: ")[1][0]
    }
    obj[index]["answer"] = answer;

    //get description
    let separator
    if (el.includes("Правильна відповідь -- ")) {
      separator = "Правильна відповідь -- "
    } else {
      separator = "Правильна відповідь:"
    }
    const description = el.split(separator)[1].split('\n').filter((el, i) => i !== 0).join("\n");
    obj[index]["description"] = description;

    //changed
    let changed = null;
    if (description.includes("зміна А") || description.includes("Змінено А")) {
      changed = "зміна А"
    }

    if (description.includes("зміна Б") || description.includes("Змінено Б")) {
      changed = "зміна Б"
    }

    if (description.includes("зміна В") || description.includes("Змінено В")) {
      changed = "зміна В"
    }

    if (description.includes("зміна Г") || description.includes("Змінено Г")) {
      changed = "зміна Г"
    }

    obj[index]["changed"] = changed;
  })
})()

console.error(obj)

function randomIntFromInterval(min, max) { // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min)
}

function App() {
  const [isQuestion, setIsQuestion] = useState(true);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    setQuestion(obj[0])
  }, [])

  const onClick = (isAnswerTrue) => {
    setIsQuestion(false)
  }

  const onNext = () => {
    const index = randomIntFromInterval(0, obj.length -1)
    setQuestion(obj[index])
    setIsQuestion(true)
  }

  const onSet = (i) => {
    document.querySelector("#menu-toggle").checked = false
    setQuestion(obj[i])
    setIsQuestion(true)
  }

  const onBack = () => {
    setIsQuestion(true)
  }

  return (
    <div className="App pb-5">

      <section className="top-nav">
        <div>
          Tests
        </div>
        <input id="menu-toggle" type="checkbox"/>
        <label className='menu-button-container' htmlFor="menu-toggle">
          <div className='menu-button'></div>
        </label>
        <ul className="menu">
          {
            obj.map((el, i) => (
              <li><button className={"btn btn-primary w-100"} onClick={() => onSet(i)}>{i+1}</button></li>
            ))
          }
        </ul>
      </section>
      {isQuestion && question &&
        <>
          <div className={"container my-2 h1"}>
            Питання номер {obj.indexOf(question) + 1}
          </div>
          <div className={"container mb-2"}>
            {question.question}
          </div>
          <div className={"container d-flex flex-column"}>
            {question.answers.map((el, i) => (
              <button type={"button"} key={i} onClick={() => onClick(el.letter === el.answer)} className="btn btn-primary m-1">{el.letter}. {el.value}</button>
            ))}
          </div>
        </>
      }
      {!isQuestion &&
      <div className={"container pb-5"}>
        <div className={"h2 my-2"}>
          Відповідь:
        </div>
        <div className={"h5"}>
          <div>{question.answer}. {question.answers.find((el) => el.letter.trim().charCodeAt() === question.answer.trim().charCodeAt()).value}
            {question.changed && <span className={"text-danger"}>(стара відповідь)</span>}
          </div>
        </div>
        {question.changed &&
          <div className={"h5 mb-4"}>
            <div>{question.changed.at(-1)}. {question.answers.find((el) => el.letter === question.changed.at(-1)).value}<span className={"text-success"}>(зміна)</span></div>
          </div>
        }
        <div className={"mb-4"}>
          {question.description}
        </div>
      </div>
      }
      {
        <div className="footer d-flex position-fixed fixed-bottom bg-light justify-content-between">
          <button disabled={isQuestion} type={"button"} className={"btn btn-primary m-1"} onClick={onBack}>До питання</button>
          <button type={"button"} className={"btn btn-primary m-1"} onClick={onNext}>Інше питання</button>
        </div>
      }
    </div>
  );
}

export default App;
