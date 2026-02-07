import { Chart, CategoryScale, LinearScale, BarElement, BarController, LineElement, PointElement, Title, Tooltip, Legend, ArcElement, DoughnutController } from 'chart.js';

// Register chart.js components used by react-chartjs-2
Chart.register(
	CategoryScale,
	LinearScale,
	BarElement,
	BarController,
	LineElement,
	PointElement,
	ArcElement,
	DoughnutController,
	Title,
	Tooltip,
	Legend
);

export default Chart;
