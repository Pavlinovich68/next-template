/* eslint-disable @next/next/no-img-element */

import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            items: [
                { label: 'Домой', icon: 'pi pi-fw pi-home', to: '/' },
                {
                    label: 'Администрирование',
                    icon: 'pi pi-fw pi-cog',
                    items: [
                        {
                            label: 'Пользователи',
                            icon: 'pi pi-fw pi-id-card',
                            to: '/uikit/formlayout',
                        }
                    ]
                },
                {
                    label: 'Справочники',
                    icon: 'pi pi-fw pi-book',
                    items: [
                        {
                            label: 'Муниципальные образования',
                            icon: 'pi pi-fw pi-building',
                            to: '/uikit/formlayout',
                        }
                    ]
                }
            ]

        }
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;