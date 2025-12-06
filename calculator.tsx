"use client";

import { useState } from "react";

export default function Calculator() {
  const [value, setValue] = useState<string>("");

  function input(v: string) {
    const el = document.querySelector(`[data-btn="${v}"]`);
    if (el) {
      el.classList.add("pressed");
      setTimeout(() => el.classList.remove("pressed"), 150);
    }

    setValue((prev) => prev + v);
  }

  function clearAll() {
    setValue("");
  }

  function backspace() {
    setValue((prev) => prev.slice(0, -1));
  }

  function calculate() {
    try {
      // Replace special characters with Math functions
      let expr = value
        .replace(/√/g, "Math.sqrt")
        .replace(/π/g, Math.PI.toString())
        .replace(/×/g, "*")
        .replace(/÷/g, "/")
        .replace(/–/g, "-");

      const result = Function('"use strict"; return (' + expr + ')')();
      setValue(result.toString());
    } catch {
      setValue("Error");
    }
  }

  function sci(fn: string) {
    try {
      let num = parseFloat(value);

      if (isNaN(num)) return;

      let result = 0;
      const radians = num * (Math.PI / 180); // Convert degrees to radians

      switch (fn) {
        case "sin":
          result = Math.sin(radians);
          break;
        case "cos":
          result = Math.cos(radians);
          break;
        case "tan":
          result = Math.tan(radians);
          break;
        case "log":
          result = Math.log10(num);
          break;
        case "ln":
          result = Math.log(num);
          break;
        case "sqrt":
          result = Math.sqrt(num);
          break;
        case "square":
          result = num * num;
          break;
        case "cube":
          result = num * num * num;
          break;
      }

      setValue(result.toString());
    } catch {
      setValue("Error");
    }
  }

  return (
    <>
      <div className="wrapper">
        <div className="calculator">
          <input className="display" value={value} readOnly />

          <div className="buttons">
            <button onClick={clearAll} className="clear">
              AC
            </button>
            <button onClick={backspace}>DEL</button>
            <button data-btn="(" onClick={() => input("(")}>
              (
            </button>
            <button data-btn=")" onClick={() => input(")")}>
              )
            </button>

            <button onClick={() => sci("sin")}>sin</button>
            <button onClick={() => sci("cos")}>cos</button>
            <button onClick={() => sci("tan")}>tan</button>
            <button className="op" data-btn="/" onClick={() => input("÷")}>
              ÷
            </button>

            <button onClick={() => sci("log")}>log</button>
            <button onClick={() => sci("ln")}>ln</button>
            <button onClick={() => sci("sqrt")}>√</button>
            <button className="op" data-btn="*" onClick={() => input("×")}>
              ×
            </button>

            <button onClick={() => sci("square")}>x²</button>
            <button onClick={() => sci("cube")}>x³</button>
            <button data-btn="π" onClick={() => input("π")}>
              π
            </button>
            <button className="op" data-btn="-" onClick={() => input("–")}>
              –
            </button>

            <button data-btn="7" onClick={() => input("7")}>
              7
            </button>
            <button data-btn="8" onClick={() => input("8")}>
              8
            </button>
            <button data-btn="9" onClick={() => input("9")}>
              9
            </button>
            <button className="op" data-btn="+" onClick={() => input("+")}>
              +
            </button>

            <button data-btn="4" onClick={() => input("4")}>
              4
            </button>
            <button data-btn="5" onClick={() => input("5")}>
              5
            </button>
            <button data-btn="6" onClick={() => input("6")}>
              6
            </button>
            <button className="eq" onClick={calculate}>
              =
            </button>

            <button data-btn="1" onClick={() => input("1")}>
              1
            </button>
            <button data-btn="2" onClick={() => input("2")}>
              2
            </button>
            <button data-btn="3" onClick={() => input("3")}>
              3
            </button>
            <button data-btn="0" onClick={() => input("0")} className="zero">
              0
            </button>
            <button data-btn="." onClick={() => input(".")}>
              .
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .wrapper {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #0a0f24, #1b2b52);
        }

        .calculator {
          width: 380px;
          padding: 25px;
          background: rgba(255, 255, 255, 0.07);
          border-radius: 25px;
          backdrop-filter: blur(15px);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .display {
          width: 100%;
          height: 70px;
          background: rgba(255, 255, 255, 0.15);
          border: none;
          border-radius: 12px;
          padding: 15px;
          text-align: right;
          font-size: 28px;
          color: #fff;
          margin-bottom: 20px;
          outline: none;
        }

        .buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
        }

        button {
          height: 55px;
          font-size: 16px;
          border: none;
          border-radius: 12px;
          color: #fff;
          cursor: pointer;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(6px);
          transition: 0.15s;
        }

        button:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
        }

        button.pressed {
          transform: scale(0.9);
        }

        .op {
          background: #ff8c00;
        }

        .eq {
          background: #009dff;
          grid-row: span 2;
          height: 100%;
        }

        .clear {
          background: #ff4655;
        }

        .zero {
          grid-column: span 2;
        }
      `}</style>
    </>
  );
}
