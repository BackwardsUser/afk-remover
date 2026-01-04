# afk-remover
A Discord bot that automatically kicks users who are alone in a voice channel for a configurable amount of time. This helps keep voice channels clear of AFK users.

## Features
*   Automatically detects when a user is left alone in a voice channel.
*   Kicks the user after a configurable time limit.
*   Users can opt-out of being kicked by assigning themselves a specific role.
*   A simple command (`~dontkick`) to let users toggle the opt-out role.
*   Optional debug logging for troubleshooting.

## Prerequisites
*   Node.js (v16 or higher recommended)
*   npm or yarn
*   A Discord bot token ([create one here](https://discord.com/developers/applications))

## Installation

### 1. Clone the repository
```
git clone https://github.com/your-username/afk-remover.git
cd afk-remover
```

### 2. Install dependencies
```
npm install
```

### 3. Configure the bot
Create a `.env` file in the project root and add the required environment variables. See the `.env Guide` section below for details.

### 4. Run the bot
```
npm run dev
```
The bot should now be online and running on your server.

## .env Guide
Your `.env` file should contain the following variables:

```
# Your private Discord bot token
TOKEN=your_bot_token_here

# The time in minutes a user can be alone in a VC before being kicked
KICK_MIN=5

# The name of the role that makes a user immune to kicks
LONER_ROLE_NAME=loner

# (Optional) Set to "true" to enable verbose logging for debugging
DEBUG=false
```

## Usage
The primary functionality is automatic. However, there is one command available for users.

*   `~dontkick`
    *   This command allows a user to give or take the role specified by `LONER_ROLE_NAME`.
    *   If the user has the role, it will be removed.
    *   If the user does not have the role, it will be added.
    *   If the role does not exist on the server, the bot will attempt to create it.

## How It Works
1.  The bot monitors voice channel activity (`voiceStateUpdate` events).
2.  When a user becomes the only person in a voice channel, a timer starts, set to the duration specified by `KICK_MIN`.
3.  If another user joins the channel before the timer ends, the timer is canceled.
4.  If the timer completes, the bot checks if the lone user has the `LONER_ROLE_NAME` role.
5.  If the user does not have the role, they are disconnected from the voice channel. Users with the role are ignored.

## Contributing
Contributions are welcome! If you have ideas for new features or find a bug, please feel free to open an issue or submit a pull request.
*   Report bugs by opening an issue.
*   Suggest new features or improvements.
*   Submit pull requests with bug fixes or new features.

## Acknowledgments
*   [Discord.js](https://discord.js.org/) for the powerful and easy-to-use library for interacting with the Discord API.
