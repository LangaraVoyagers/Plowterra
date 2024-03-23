import { ApexOptions } from "apexcharts";
import DashBoardLayout from 'components/dashboard';
import { Fragment } from 'react/jsx-runtime';

const Home = () => {
	const seasonOptions = [
    { label: "Season1", value: "Season1" },
    { label: "Season2", value: "Season2" },
    { label: "Season3", value: "Season3" },
    { label: "Season4", value: "Season4" },
    { label: "Season5", value: "Season5" },
    { label: "Season6", value: "Season6" },
  ];

  const graphSeries = [{
    name: 'Month',
    data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
  }];

  const graphOptions: ApexOptions = {
    chart: {
      height: 350,
      type: "area",
      toolbar: {
        show: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 1,
      colors: ["#15A260"]
    },
    fill: {
      colors: ["#15A260"]
    },
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
    },
    tooltip: {
      x: {
        format: 'dd/MM/yy'
      },
			
    },
		colors: ["#15A260"]
  }
	
	return (
		<Fragment>
			<DashBoardLayout 
				seasonOptions={seasonOptions} 
				graphSeries={graphSeries} 
				graphOptions={graphOptions} />
		</Fragment>
	);
};

export default Home;
