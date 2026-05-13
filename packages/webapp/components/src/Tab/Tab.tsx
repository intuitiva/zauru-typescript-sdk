import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import React from "react";

export type TabItem = { title: string; link: string };

type Props = {
  items: Array<TabItem>;
};

//<reference> https://www.creative-tim.com/learning-lab/tailwind-starter-kit/documentation/react/tabs/text
export const Tabs = (props: Props) => {
  const { items } = props;
  const [openTab, setOpenTab] = React.useState(1);
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <ul
            className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row"
            role="tablist"
          >
            {items?.map((item: TabItem, index: number) => {
              return (
                <li
                  key={index}
                  className="mb-px mr-2 last:mr-0 flex-auto text-center"
                >
                  <a
                    key={index}
                    className={
                      "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                      (openTab === index
                        ? "text-white bg-red-600"
                        : "text-red-600 bg-white")
                    }
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenTab(index);
                      redirect(item.link);
                    }}
                    data-toggle="tab"
                    href={item.link}
                    role="tablist"
                  >
                    {item.title}
                  </a>
                </li>
              );
            })}
          </ul>
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
