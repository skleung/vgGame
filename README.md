
# vgGame

A chat client to gamify the image annotation for VisualGenome

## How to use

```
$ npm update
$ npm install
$ node .
```

And point your browser to `http://localhost:4000`.

## TODO:

- [x] Add interface for first user to enter a sentence
- [ ] Cycling through users (Kenji)
- [ ] Save the sentence that is collected to Parse (Sherman)
- [x] Build socket connections to understand when people are hitting words within the sentence (Sherman)
- [x] Build logic to update scoreboard accordingly (Sherman)
- [ ] Transitioning to next game (Kenji)
- [ ] Animating and polishing up the look of the app (Sherman)
- [ ] Integrate dynamic image URLs (Kenji)

## Features

- Multiple users can join a chat room by each entering a unique username
on website load.
- Users can type chat messages to the chat room.
- A notification is sent to all users when a user joins or leaves
the chatroom.
