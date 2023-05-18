'use client';

import { useContext, useEffect } from 'react';

import { ChatContext } from '@/context/ChatContext';
import { Role } from '@/utils/constants';
// import { exampleMessages } from '@/utils/exampleMessages';
import { initEventListenerScroll } from '@/utils/scroll';

import { Message, SystemMessage } from './Message';

const SYSTEM_MESSAGE = (
  <>
    由GPT-3.5套壳制作
    <br />
    属于nk特色，请勿外传
  </>
);
const WELCOME_MESSAGE = '这节课，我们答疑，有问必答';
const LOADING_MESSAGE = '你，加油啊......';

export const Messages = () => {
  let { isLoading, messages, history, historyIndex, startNewChat } = useContext(ChatContext)!;

  // 初始化滚动事件
  useEffect(initEventListenerScroll, []);

  // 如果当前在浏览聊天记录，则展示该聊天记录的 messages
  if (history && typeof historyIndex === 'number') {
    messages = history[historyIndex].messages;
  }

  // messages = exampleMessages;

  return (
    <div className="md:grow" style={{ display: 'flow-root' }}>
      <SystemMessage>{SYSTEM_MESSAGE}</SystemMessage>
      <Message role={Role.assistant} content={WELCOME_MESSAGE} />
      {messages.map((message, index) => (
        <Message key={index} {...message} />
      ))}
      {isLoading && <Message role={Role.assistant} content={LOADING_MESSAGE} />}
      {messages.length > 1 && (
        <SystemMessage>
          有题吗？有题可以
          <a className="text-gray-link" onClick={startNewChat}>
            开启新对话
          </a>
        </SystemMessage>
      )}
    </div>
  );
};
