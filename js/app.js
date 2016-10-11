class CounterButton extends Dilithium.Component {
  constructor(props) {
    super();
    this.state = {count: 0};
    setInterval(() => {
      this.setState({count: this.state.count + 1})
    })
  }

  render() {
    return (
      <div>
        <h1>{this.props.title}</h1>
        <ColorSwatch number={this.state.count}/>
        <div>
          Count:
          <span>{this.state.count}</span>
        </div>
      </div>
    )
  }
}

class ColorSwatch extends Dilithium.Component {
  render() {
    const red = this.props.number % 256;
    return (
      <div
        style={{
          backgroundColor: `rgb(${red}, 0, 0)`,
          height: '50px',
          width: '50pc'
        }}
      />
    )
  }
}

Dilithium.Render(
  <CounterButton title="Hello React Rally!"/>,
  document.getElementById('container')
);