    import React, { useEffect, useState, useRef } from 'react';
    import { Line } from 'react-chartjs-2';
    import { getAll } from '../../api/api';
    import { Chart, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';

    Chart.register(LinearScale, CategoryScale, PointElement, LineElement);

    const UserChart = () => {
        const [userData, setUserData] = useState([]);
        const chartRef = useRef();

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const response = await getAll();
                    setUserData(response.data);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu người dùng:', error);
                }
            };

            fetchData();

            // Cleanup chart before component unmounts
            return () => {
                if (chartRef.current) {
                    chartRef.current.destroy();
                }
            };
        }, []);

        if (!userData || userData.length === 0) {
            return <p>Loading...</p>;
        }

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Tháng bắt đầu từ 0
        const userCountByDate = userData.reduce((acc, user) => {
            const dateParts = user.datecreated.split('/');
            const day = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const year = parseInt(dateParts[2], 10);
            
            const date = new Date(year, month - 1, day); // Tháng bắt đầu từ 0
            console.log(date)
            if (!isNaN(date.getTime()) && date.getMonth() + 1 === currentMonth) {
                acc[day] = (acc[day] || 0) + 1;
            }
            return acc;
        }, {});
        
        

        const chartData = {
            labels: Object.keys(userCountByDate).map(day => parseInt(day, 10)),
            datasets: [
                {
                    label: 'Số lượng người dùng đã tạo trong tháng',
                    data: Object.values(userCountByDate),
                    fill: false,
                    borderColor: '#3498db',
                    borderWidth: 2,
                },
            ],
        };
        const chartOptions = {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        stepSize: 1,
                        callback: (value, index) => `Ngày ${value}`, // Format labels as "Ngày {day}"
                    },
                },
                y: {
                    beginAtZero: true,
                    max: 15,
                },
            },
        };

        return (
            <div>
                <h2>Biểu đồ thống kê người dùng đã tạo trong tháng</h2>
                <Line ref={chartRef} data={chartData} options={chartOptions} />
            </div>
        );
    };

    export default UserChart;
