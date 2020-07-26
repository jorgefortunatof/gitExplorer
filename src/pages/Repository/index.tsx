import React from 'react';
import { useRouteMatch } from 'react-router-dom';

interface RepositoryParams {
	repository: string;
}

const Repository: React.FC = () => {
	const { params } = useRouteMatch<RepositoryParams>();

	return (
		<h1>
			Seus Repositórios:
			{params.repository}
		</h1>
	);
};

export default Repository;
