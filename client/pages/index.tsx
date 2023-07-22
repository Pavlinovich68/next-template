/* eslint-disable @next/next/no-img-element */

import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../demo/service/ProductService';
import { LayoutContext } from '../layout/context/layoutcontext';
import Link from 'next/link';
import { Demo } from '../types/types';
import { ChartData, ChartOptions } from 'chart.js';

const HomePage = () => {
    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Добашняя страница</h5>
                    <p>Место для вашего контента</p>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
