import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './Metrics.css';


const VIEW_ID = '466427526';

function Metrics() {
  const [data, setData] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartData2, setChartData2] = useState(null);

  // Fonction pour transformer les données de l'API en format Chart.js
  const transformDataForChart = (apiData) => {
    // Trier les données par date (du plus ancien au plus récent)
    const sortedRows = apiData.rows.sort((a, b) => b.dimensionValues[0].value.localeCompare(a.dimensionValues[0].value));

    // Inverser les données pour que le graphique aille de gauche à droite
    const reversedRows = sortedRows.reverse();

    // Extraire les labels, activeUsers et newUsers
    const labels = reversedRows.map(row => {
      const dateStr = row.dimensionValues[0].value;
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    });

    const activeUsers = reversedRows.map(row => parseInt(row.metricValues[0].value, 10));
    const newUsers = reversedRows.map(row => parseInt(row.metricValues[1].value, 10));
    const session = reversedRows.map(row => parseInt(row.metricValues[2].value, 10));


    return {
      labels,
      datasets: [
        {
          label: 'Active Users',
          data: activeUsers,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'New Users',
          data: newUsers,
          borderColor: 'rgba(255, 99, 132, 1)', // Couleur rouge pour newUsers
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },
        {
          label: 'Sessions',
          data: session,
          borderColor: 'rgba(30, 99, 132, 1)', // Couleur rouge pour newUsers
          backgroundColor: 'rgba(35, 99, 255, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        }

      ],
    };
  };

  // Fonction pour transformer les données de l'API en format Chart.js
  const transformDataForChart2 = (apiData) => {
    // Trier les données par date (du plus ancien au plus récent)
    const sortedRows = apiData.rows.sort((a, b) => b.dimensionValues[0].value.localeCompare(a.dimensionValues[0].value));

    // Inverser les données pour que le graphique aille de gauche à droite
    const reversedRows = sortedRows.reverse();

    // Extraire les labels, activeUsers et newUsers
    const labels = reversedRows.map(row => {
      const dateStr = row.dimensionValues[0].value;
      return `${dateStr.slice(0, 4)}-${dateStr.slice(4, 6)}-${dateStr.slice(6, 8)}`;
    });


    const averageSessionDuration = reversedRows.map(row => parseInt(row.metricValues[3].value, 10));

    return {
      labels,
      datasets: [

        {
          label: 'averageSessionDuration',
          data: averageSessionDuration,
          borderColor: 'rgba(30, 20, 5, 1)', // Couleur rouge pour newUsers
          backgroundColor: 'rgba(35, 30, 5, 0.2)',
          borderWidth: 2,
          tension: 0.4,
        },

      ],
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://server.pronostics.devforever.ovh/api/analytics');
        setData(response.data);
        const chartFormattedData = transformDataForChart(response.data);
        const chartFormattedData2 = transformDataForChart2(response.data);
        setChartData(chartFormattedData);
        setChartData2(chartFormattedData2);
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="metrics-container">
      <h2>Google Analytics Dashboard (Active & New Users)</h2>
      {chartData ? (
        <div className="metrics-container">
        <div className="chart-wrapper">
          <Line
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: false, // Afficher toutes les dates
                  },
                },
              },
            }}
          />
        </div>
      
        <div className="chart-wrapper">
          <Line
            data={chartData2}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' },
              },
              scales: {
                x: {
                  ticks: {
                    maxRotation: 45,
                    minRotation: 45,
                    autoSkip: false, // Afficher toutes les dates
                  },
                },
              },
            }}
          />
        </div>
      </div>




      ) : (
        <p>Chargement des données...</p>
      )}
    </div>
  );
}

export default Metrics;
