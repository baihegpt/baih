'use client';

import { AdjustmentsHorizontalIcon, InboxStackIcon } from '@heroicons/react/24/outline';
import classNames from 'classnames';
import type { FC, ReactNode } from 'react';
import { useCallback, useContext, useEffect } from 'react';

import { DeviceContext } from '@/context/DeviceContext';
import { MenuContext, MenuKey } from '@/context/MenuContext';
import { sleep } from '@/utils/sleep';

import { LoginButton } from './buttons/LoginButton';
import { MenuEntryButton } from './buttons/MenuEntryButton';
import { History } from './History';

/**
 * 菜单栏
 */
export const Menu = () => {
  const { isWeChat } = useContext(DeviceContext)!;
  const { isMenuShow } = useContext(MenuContext)!;

  return (
    <>
      <div className={classNames('fixed z-20 top-0 right-0 md:hidden', { absolute: isWeChat, hidden: isMenuShow })}>
        <MenuEntryButton />
      </div>
      <MenuMask>
        <MenuTabs />
        <MenuTabsContent />
        <MenuFooter />
      </MenuMask>
    </>
  );
};

/**
 * 菜单栏蒙层
 */
const MenuMask: FC<{ children: ReactNode }> = ({ children }) => {
  const { windowHeight, isMobile } = useContext(DeviceContext)!;
  const { isMenuShow, setIsMenuShow } = useContext(MenuContext)!;

  const onTouchMask = useCallback(async () => {
    setIsMenuShow(false);
    // 由于 transform 的 fixed 定位失效问题，这里需要手动设置和取消 form-container 的 top
    await sleep(300);
    const formContainer = document.getElementById('form-container');
    if (formContainer) {
      formContainer.style.top = 'unset';
    }
  }, [setIsMenuShow]);

  return (
    <>
      <div
        // 这是蒙层
        className={classNames('fixed z-20 top-0 left-0 w-screen bg-[rgba(0,0,0,0.4)] md:hidden', {
          hidden: !isMenuShow,
        })}
        style={{ height: windowHeight }}
        onTouchStart={onTouchMask}
        onClick={onTouchMask}
      />
      <div
        // 这是菜单栏内容
        // 293px 是 768px 的黄金分割点，293 + 16 * 2 = 325
        className={classNames('fixed left-[100vw] w-[calc(100vw-6.25rem)] md:block md:static md:w-[325px]', {
          hidden: !isMenuShow,
        })}
      >
        <div
          className={`w-inherit fixed flex flex-col bg-gray-100 border-l border-gray
                      md:h-screen md:tall:h-[calc(100vh-12rem)] md:border-l-0 md:border-r
                      dark:bg-gray-900`}
          style={isMobile ? { height: windowHeight } : {}}
        >
          {children}
        </div>
      </div>
    </>
  );
};

const IconMap = {
  [MenuKey.InboxStack]: InboxStackIcon,
  [MenuKey.AdjustmentsHorizontal]: AdjustmentsHorizontalIcon,
};

/**
 * 菜单栏 tabs
 */
const MenuTabs = () => {
  const { currentMenu, setCurrentMenu } = useContext(MenuContext)!;

  return (
    <menu
      className={`w-inherit flex z-10 justify-end bg-chat-100 border-b-[0.5px] border-gray
                  md:flex-row-reverse md:px-4 md:border-r`}
    >
      {[MenuKey.InboxStack, MenuKey.AdjustmentsHorizontal].map((key) => {
        const Icon = IconMap[key];
        return (
          <button
            key={key}
            className={classNames({
              'text-gray-700 hover:text-gray-700': currentMenu === key,
              'dark:text-gray-200 dark:hover:text-gray-200': currentMenu === key,
            })}
            onClick={() => setCurrentMenu(key)}
          >
            <Icon />
          </button>
        );
      })}
      <div className="grow" />
      <LoginButton />
    </menu>
  );
};

/**
 * 菜单栏 tabs 内容
 */
const MenuTabsContent = () => {
  const { currentMenu } = useContext(MenuContext)!;

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // 暗色模式
      link.href = '/prism-dark.css';
    } else {
      // 浅色模式
      link.href = '/prism-light.css';
    }
    document.head.appendChild(link);

    let darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
      if (e.matches) {
        // 暗色模式
        link.href = '/prism-dark.css';
      } else {
        // 浅色模式
        link.href = '/prism-light.css';
      }
    });
  }, []);

  return (
    <div className="grow overflow-y-auto md:px-4">
      {currentMenu === MenuKey.InboxStack && <History />}
      {currentMenu === MenuKey.AdjustmentsHorizontal && (
        <>
          {/* <div className="m-4">
            模型：
            <select
              value={completionParams.model}
              onChange={(e) =>
                setCompletionParams({
                  ...completionParams,
                  model: e.target.value as Model,
                })
              }
            >
              {Object.values(CompletionParamsModel).map((model) => (
                <option key={model}>{model}</option>
              ))}
            </select>
          </div>
          <div className="m-4">
            <label>
              流式响应：
              <input
                defaultChecked={completionParams.stream}
                type="checkbox"
                onChange={(e) =>
                  setCompletionParams({
                    ...completionParams,
                    stream: e.target.checked,
                  })
                }
              />
            </label>
          </div> */}
        </>
      )}
    </div>
  );
};

/**
 * 菜单栏底部
 */
const MenuFooter = () => {
  return (
    <div
      className={`flex-none px-4 py-5 text-center text-gray text-sm border-t-[0.5px] border-gray
                  pb-[calc(1.25rem+env(safe-area-inset-bottom))]`}
    >
     交流v:15522668322
    </div>
  );
};
