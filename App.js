import React, { Component } from 'react';
import './App.css';
import moment from 'moment';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            time: 25 * 60 * 1000,
            breakValue: 5,
            sessionValue: 25,
            active: false,
            type: 'session',
            touched: false
        }

        this.handleIncrement = this.handleIncrement.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.handlePlayPause = this.handlePlayPause.bind(this);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.time === 0 && prevState.type === 'session') {
            this.setState({ time: prevState.breakValue * 60 * 1000, type: 'break' });
            this.audio.play();
        }
        if (prevState.time === 0 && prevState.type === 'break') {
            this.setState({ time: prevState.sessionValue * 60 * 1000, type: 'session' });
            this.audio.play();
        }
    }

    handleIncrement = (inc, mode) => {
        /*if (mode === "sessionValue") {
            this.setState({ time: (this.state[mode] + (inc ? 1 : -1)) * 60 * 1000 })
        }*/
        if (this.state[mode] === 60 && inc) return
        if (this.state[mode] === 1 && !inc) return
        this.setState({ [mode]: this.state[mode] + (inc ? 1 : -1)});
    }

    handleReset = () => {
        this.setState({ breakValue: 5, sessionValue: 25, active: false, time: 25 * 60 * 1000, type: 'session', touched: false });
        clearInterval(this.countdown);
        this.audio.pause();
        this.audio.currentTime = 0;
    }

    handlePlayPause = () => {
        if (this.state.active) {
            clearInterval(this.countdown);
            this.audio.pause();
            this.setState({ active: false });
        } else {
            if (this.state.touched) {
                this.countdown = setInterval(() => this.setState({ time: this.state.time - 1000 }), 1000);
                this.setState({ active: true });
            } else {
                this.setState({ time: this.state.sessionValue * 60 * 1000, touched: true, active: true });
                this.countdown = setInterval(() => this.setState({ time: this.state.time - 1000 }), 1000);
            }
        }
    }

    render() {
        return (
            <div className="App">
                <div className="setTimer">
                    <SetTimer mode="break" value={this.state.breakValue} handleIncrement={this.handleIncrement}/>
                    <SetTimer mode="session" value={this.state.sessionValue} handleIncrement={this.handleIncrement}/>
                </div>
                <Timer type={this.state.type} time={moment(this.state.time).format("mm:ss")} handleReset={this.handleReset} playing={this.state.active} handlePlayPause={this.handlePlayPause}/>
                <audio id="beep" src="https://goo.gl/65cBl1" ref={ref => this.audio = ref}></audio>
            </div>
        );
    }
}



const SetTimer = ({ mode, value, handleIncrement }) => (
    <div className="break_session-length" id={`${mode}Length`}>
        <h1 id={`${mode}-label`}>{mode === "session" ? "Session" : "Break"} Length</h1>
        <div className="break-value">
            <button id={`${mode}-decrement`} onClick={() => handleIncrement(false, `${mode}Value`)}><i class="fas fa-minus"></i></button>
            <h1 id={`${mode}-length`} className="value">{value}</h1>
            <button id={`${mode}-increment`} onClick={() => handleIncrement(true, `${mode}Value`)}><i class="fas fa-plus"></i></button>
        </div>
    </div>
)

const Timer = ({ type, time, handleReset, playing, handlePlayPause }) => (
    <div className="timer">
        <h1 id="timer-label">{type === 'session' ? "Session" : "Break"}</h1>
        <h1 id="time-left">{time}</h1>
        <div className="controls">
            <button id="start_stop" onClick={handlePlayPause}>{playing ? <i class="fas fa-pause"></i> :<i class="fas fa-play"></i> }</button>
            <button id="reset" onClick={handleReset}><i class="fas fa-redo"></i></button>
        </div>
    </div>
)

export default App;
