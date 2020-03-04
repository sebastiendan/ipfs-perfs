# ipfs-perfs

A web app to observe and challenge the IPFS network performances

<img width="385" alt="Screen Shot 2020-02-28 at 15 43 03" src="https://user-images.githubusercontent.com/12198372/75520138-2dc12800-5a48-11ea-9527-d0e494f2e04c.png">

<img width="385" alt="Screen Shot 2020-02-28 at 16 35 51" src="https://user-images.githubusercontent.com/12198372/75520247-711b9680-5a48-11ea-90e2-afad018d3c63.png">

## Prerequisites

- NodeJS > 12

## Installation

```
$ git clone git@github.com:sebastiendan/ipfs-perfs.git
$ cd ipfs-perfs
$ npm install
$ npm run build && npm run start:prod
```

## Usage

- Open http://localhost:3333 in your browser
- Select a buffer size
- Click on the `Start` button

## 何これ?

`ipfs-perfs` leverages the Javascript IPFS client ([js-ipfs](https://github.com/ipfs/js-ipfs)) to test the performances of I/O operations over the IPFS network.

Starting the app (see [Installation](#installation)) spawns two concurrent IPFS local daemons (nodes) on your machine.

Starting a test through the UI (see [Usage](#usage)) will run the following synchronous sequence (it will iterate over it infinitely):

- Generate a unique Buffer of the requested size
- Make the first IPFS node add the Buffer to the network
- Make the second IPFS node get the Buffer from the network
- Capture execution times of both operations and plot them
