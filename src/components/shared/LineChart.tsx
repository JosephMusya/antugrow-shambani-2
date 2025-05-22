import React from "react";
import Chart from "react-apexcharts";
import { type ApexOptions } from "apexcharts";

interface LineChartProps {
    series: ApexAxisChartSeries;
    categories?: (string | number)[];
    styles?: React.CSSProperties;
    height?: number;
    title?: string;
}

const CustomLineChart: React.FC<LineChartProps> = ({
    series,
    categories,
    styles,
    height = 400,
}) => {
    const options: ApexOptions = {
        chart: {
            id: "smooth-line",
            toolbar: {
                show: true,
                tools: {
                    download: false,
                    selection: false,
                    zoom: false,
                    zoomin: true,
                    zoomout: true,
                    pan: false,
                    reset: false,
                    customIcons: [],
                },
            },
        },
        xaxis: {
            categories,
            tickAmount: 5,
        },
        yaxis: {
            labels: {
                formatter: (value: number) => value.toFixed(2),
            },
            tickAmount: 5,
        },
        stroke: {
            curve: "smooth",
            width: 3,
        },
        legend: {
            show: true,
            position: "top",
            horizontalAlign: "left",
            fontSize: "11px",
            onItemClick: {
                toggleDataSeries: true,
            },
        },
    };

    return (
        <div style={{ ...styles }} className="line-chart">
            <Chart
                width="100%"
                height={height}
                series={series}
                options={options}
                type="line"
            />
        </div>
    );
};

export default CustomLineChart;
