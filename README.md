
# vgChat

A chat client to gamify the image annotation for VisualGenome

## How to use

```
$ npm install
$ node .
```

And point your browser to `http://localhost:3000`.

## TODO:

- [x] Add BLEU score script (see `VG.js`)
- [ ] Figure out how to interact with Redis or some storage service we can use to save results of each run
- [ ] Actually use BLEU score to determine threshold of similar sentences
- [ ] Save and update hits on the application to determine when people are converging
- [ ] Decide on a nice way to display score information
## Features

- Multiple users can join a chat room by each entering a unique username
on website load.
- Users can type chat messages to the chat room.
- A notification is sent to all users when a user joins or leaves
the chatroom.
