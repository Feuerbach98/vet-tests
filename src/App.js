import './App.css';
import {text} from "./text";
import {useEffect, useState} from "react";

const obj = [];

(function parseData() {
  let newText = text.split("Завдання №").filter((el) => el !== "" && el !== "\n");
  newText.forEach((el) => {
    //question number
    const index = parseInt(el) - 1;

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
    const answer = el.split("Правильна відповідь -- ")[1][0]
    obj[index]["answer"] = answer;

    //get description
    const description = el.split("Правильна відповідь -- ")[1].split('\n').filter((el, i) => i !== 0).join("\n");
    obj[index]["description"] = description;

    //changed
    let changed = null;
    if (description.includes("зміна А")) {
      changed = "зміна А"
    }

    if (description.includes("зміна Б")) {
      changed = "зміна Б"
    }

    if (description.includes("зміна В")) {
      changed = "зміна В"
    }

    if (description.includes("зміна Г")) {
      changed = "зміна Г"
    }

    obj[index]["changed"] = changed;
  })
})()

console.error(obj)

function App() {
  const [isQuestion, setIsQuestion] = useState(true);
  const [question, setQuestion] = useState(null);

  useEffect(() => {
    setQuestion(obj[0])
  }, [])

  const onClick = () => {
    setIsQuestion(false)
  }

  const onNext = () => {
    const index = obj.indexOf(question) + 1;
    setQuestion(obj[index])
    setIsQuestion(true)
  }

  const onBack = () => {
    setIsQuestion(true)
  }

  return (
    <div className="App">
      {isQuestion && question &&
        <>
          <div className={"container mb-2 h1"}>
            Питання номер {obj.indexOf(question) + 1}
          </div>
          <div className={"container mb-2"}>
            {question.question}
          </div>
          <div className={"container d-flex flex-column"}>
            {question.answers.map((el, i) => (
              <button type={"button"} key={i} onClick={onClick} className="btn btn-primary m-1">{el.letter}. {el.value}</button>
            ))}
          </div>
        </>
      }
      {!isQuestion &&
      <div className={"container"}>
        <div className={"h2 mb-2"}>
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
        <button type={"button"} className={"btn btn-secondary m-1"} onClick={onBack}>Назад</button>
        <button type={"button"} className={"btn btn-secondary m-1"} onClick={onNext}>Наступне питання</button>
      </div>
      }
    </div>
  );
}

export default App;
