import React, { useEffect, useState } from 'react';
import { useRouteMatch, Link } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import api from '../../services/api';

import { Header, RepositoryInfo, Issues } from './styles';
import logo from '../../assets/logo.svg';

interface RepositoryParams {
	repository: string;
}

interface Repository {
	full_name: string;
	description: string;
	stargazers_count: number;
	forks_count: number;
	open_issues_count: number;

	owner: {
		login: string;
		avatar_url: string;
	};
}

interface Issue {
	id: number;
	title: string;
	user: {
		login: string;
	};
	html_url: string;
}

const Repository: React.FC = () => {
	const { params } = useRouteMatch<RepositoryParams>();

	const [repository, setRepository] = useState<Repository | null>(null);
	const [issues, setIssues] = useState<Issue[]>([]);

	useEffect(() => {
		async function loadData(): Promise<void> {
			const [repositoryResponse, issuesResponse] = await Promise.all([
				api.get<Repository>(`repos/${params.repository}`),
				api.get<Issue[]>(`repos/${params.repository}/issues`),
			]);

			setRepository(repositoryResponse.data);
			setIssues(issuesResponse.data);
		}
		loadData();
	}, [params.repository]);

	return (
		<>
			<Header>
				<img src={logo} alt="logo" />
				<Link to="/">
					<FiChevronLeft size={16} />
					voltar
				</Link>
			</Header>

			{repository && (
				<RepositoryInfo>
					<header>
						<img src={repository.owner.avatar_url} alt="avatar" />
						<div>
							<strong>{repository.full_name}</strong>
							<p>{repository.description}</p>
						</div>
					</header>
					<ul>
						<li>
							<strong>{repository.stargazers_count}</strong>
							<span>Starts</span>
						</li>
						<li>
							<strong>{repository.forks_count}</strong>
							<span>Forks</span>
						</li>
						<li>
							<strong>{repository.open_issues_count}</strong>
							<span>Issues Abertas</span>
						</li>
					</ul>
				</RepositoryInfo>
			)}

			<Issues>
				{issues.map(issue => (
					<a
						key={issue.id}
						href={issue.html_url}
						target="_blank"
						rel="noreferrer"
					>
						<div>
							<strong>{issue.title}</strong>
							<p>{issue.user.login}</p>
						</div>
						<FiChevronRight size={20} />
					</a>
				))}
			</Issues>
		</>
	);
};

export default Repository;
