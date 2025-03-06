### Development 
#### Introduction

This simple web page similar to https://chat.openai.com/, which only needs to implement the most basic AI conversation function described as follows:
1. Allow users to enter an OpenRouter API key to call gpt-3.5-turbo-1106.
2. Continuous chatting with the AI.
3. After refreshing the web page, there's no need to retain the chat history before the refresh. Simply start a new chat directly.


### Project Structure

```
├── src
│   ├── App.tsx                          # Core Component
│   ├── Static                           # Asset Folder
│   ├── components
│   │   ├── InputBox                     # Input Component
│   │   │                
│   │   ├── MessageBubble                # Massage Component
│   │   │
│   │   ├── Notification                 # Notification Component
│   │   
│   │ 
│   └─
├── package.json                         # Config File              
```

### Quick Start
```

# Run the Project
yarn start

# Run Test
yarn test 

# Run Bundle
yarn build

# Deploy the Project
yarn run deploy 
```
