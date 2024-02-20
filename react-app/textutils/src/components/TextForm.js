import React, { useState } from "react";

export default function TextForm(props) {
  const [text, setText] = useState(""); // this is used define the state for text  and setText is used to set the text value to new value
  //   text = 'Enter text' ;  //wrong way to change the state of text field
  //   setText("new text");   //correct way to change the state of text field

  const onChangeHandler = (event) => {
    setText(event.target.value); // sets the text field value to the new value without changing the state we can not able to change the state manually
  };

  const changeToUc = () => {
    const newText = text.toUpperCase();
    setText(newText); // sets the text field value to the new value
    props.showAlert('Converted to Uppercase!','success');
  };

  const changeToLc = () => {
    const newText = text.toLowerCase();
    setText(newText); // sets the text field value to the new value
    props.showAlert('Converted to Lowercase!','success');
  };

  const clearText = () => {
    setText(""); //
    props.showAlert('Text Cleared','success');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    props.showAlert('Copied to clipboard!','success');
  };

  const removeExtraSpace = () => {
    let newText = text.split(/ [  ] +/);
    setText(newText.join(" "));
    props.showAlert('Extra Space has been removed!','success');
  };

  return (
    <>
      <div className="conatainer" style = {{color: props.mode === 'dark' ? 'white' : 'black'}}>
        <h1>{props.heading}</h1>
        <div className="mb-3 my-3">
          <textarea
            className="form-control"
            value={text}
            id="myBox"
            rows="8"
            onChange={onChangeHandler}
            style = {{backgroundColor: props.mode === 'dark' ? 'gray' : 'white', color:props.mode === 'dark' ? 'white' : 'black'}}
          ></textarea>
        </div>
        <button disabled = {text.length === 0} className="btn btn-primary" onClick={changeToUc}>
          Convert to Uppercase
        </button>
        <button disabled = {text.length === 0} className="btn btn-success mx-1 my-1" onClick={changeToLc}>
          Convert to Lowercase
        </button>
        <button disabled = {text.length === 0} className="btn btn-info" onClick={clearText}>
          Clear text
        </button>
        <button disabled = {text.length === 0} className="btn btn-warning mx-1 my-1" onClick={copyToClipboard}>
          Copy text
        </button>

        <button disabled = {text.length === 0} className="btn btn-primary" onClick={removeExtraSpace}>
          Remove extra space
        </button>
      </div>
      <div className="conatiner my-3" style = {{color: props.mode === 'dark' ? 'white' : 'black'}}>
        <h2>Your text summary</h2>
        <p>
          {text.split(/\s+/).filter((element)=> element.length !== 0).length} words and {text.length} characters
        </p>
        <p>{0.008 * text.split(" ").filter((element)=> element.length !== 0).length} Minutes read</p>
        <h2>Preview</h2>
        <p>{text.length>0 ? text : 'Enter your text to preview'}</p>
      </div>
    </>
  );
}
