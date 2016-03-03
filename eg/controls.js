const keypress = require('keypress');
const five = require('johnny-five');
const songs = require('j5-songs');

const board = new five.Board({
  port: process.argv[2]
});

const MAX_SPEED = 200;
const MAX_SPEED_TURNS = 85;

board.on('ready', function (err) {
  if (err) {
    console.log('Oops, there was an error:', err);
    return;
  }

  const motors = {
    left: new five.Motor([6, 7]),
    right: new five.Motor([5, 4])
  };

  const piezo = new five.Piezo(8);

  this.repl.inject({
    motors: motors,
    piezo: piezo
  });

  console.info('Board connected. Welcome to mBot Controls!');
  console.log('Control the bot with the right arrow keys, and SPACE to stop.');

  function controls(ch, key) {
    if ( !key ) { return; }

    if ( key.name === 'q' ) {
      console.log('Quitting mBot Controls');
      motors.left.stop();
      motors.right.stop();
      process.exit();
    }

    if ( key.name === 'space' ) {
      console.log('Stopping');
      motors.left.stop();
      motors.right.stop();
    }

    if ( key.name === 'up' ) {
      console.log('Going forward');
      motors.left.rev(MAX_SPEED);
      motors.right.fwd(MAX_SPEED);
    }

    if ( key.name === 'down' ) {
      console.log('Going backward');
      motors.left.fwd(MAX_SPEED);
      motors.right.rev(MAX_SPEED);
    }

    if ( key.name === 'right' ) {
      console.log('Going right');
      motors.left.rev(MAX_SPEED_TURNS);
      motors.right.rev(MAX_SPEED_TURNS);
    }

    if ( key.name === 'left' ) {
      console.log('Going left');
      motors.left.fwd(MAX_SPEED_TURNS);
      motors.right.fwd(MAX_SPEED_TURNS);
    }

    if ( key.name === 't' ) {
      console.log('Turbo Boost!!');
      motors.left.rev(255);
      motors.right.fwd(255);
    }

    if ( key.name === 'r' ) {
      console.log('You got Rick Rolled!!');
      piezo.play(songs.load('never-gonna-give-you-up'));
      motors.left.fwd(255);
      motors.right.fwd(255);
    }
  }

  keypress(process.stdin);
  process.stdin.on('keypress', controls);
  process.stdin.setRawMode(true);
  process.stdin.resume();
});