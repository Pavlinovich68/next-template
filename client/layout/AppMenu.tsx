/* eslint-disable @next/next/no-img-element */

import React, {useContext, useEffect, useState} from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import { AppMenuItem } from '../types/types';
import {Context} from "../pages/_app";

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { store } = useContext(Context);

    const checkRoles = (data: string[] | undefined) => {
        if (!data){
            return true;
        }
        let intersection = store.user.roles.filter(i => data.includes(i.name));
        return intersection.length > 0;
    };

    const model: AppMenuItem[] = [
        {
            label: 'Обзор',
            items: [{ label: 'Домашняя страница', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
          seperator: true
        },
        {
            label: 'Иерархия меню',
            visible: checkRoles(['admin']),
            items: [
                {
                    label: 'Подменю 1',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Подменю 1.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Подменю 1.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Подменю 1.1.2', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Подменю 1.1.3', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Подменю 1.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Подменю 1.2.1', icon: 'pi pi-fw pi-bookmark' }]
                        }
                    ]
                },
                {
                    label: 'Подменю 2',
                    icon: 'pi pi-fw pi-bookmark',
                    items: [
                        {
                            label: 'Подменю 2.1',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [
                                { label: 'Подменю 2.1.1', icon: 'pi pi-fw pi-bookmark' },
                                { label: 'Подменю 2.1.2', icon: 'pi pi-fw pi-bookmark' }
                            ]
                        },
                        {
                            label: 'Подменю 2.2',
                            icon: 'pi pi-fw pi-bookmark',
                            items: [{ label: 'Подменю 2.2.1', icon: 'pi pi-fw pi-bookmark' }]
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
                    return !item?.seperator ? ( <AppMenuitem item={item} root={true} index={i} key={item.label} />) : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
