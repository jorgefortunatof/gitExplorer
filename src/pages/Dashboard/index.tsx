import React, { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronRight } from 'react-icons/fi';

import api from '../../services/api';
import logo from '../../assets/logo.svg';
import { Title, Form, Repositories, Error } from './styles';

interface Repository {
	full_name: string;
	description: string;
	owner: {
		login: string;
		avatar_url: string;
	};
}

const Dashboard: React.FC = () => {
	const [newRepo, setNewRepo] = useState('');
	const [inputError, setInputError] = useState('');
	const [repositories, setRepositories] = useState<Repository[]>(() => {
		const storageRepositories = localStorage.getItem('@GithubExplorer');
		if (storageRepositories) {
			return JSON.parse(storageRepositories);
		}
		return [];
	});

	useEffect(() => {
		localStorage.setItem('@GithubExplorer', JSON.stringify(repositories));
	}, [repositories]);

	async function handleAddRepository(
		event: FormEvent<HTMLFormElement>,
	): Promise<void> {
		event.preventDefault();

		setInputError('');

		if (!newRepo) {
			setInputError('Repositório não informado!');
			return;
		}

		try {
			const response = await api.get<Repository>(`/repos/${newRepo}`);
			const repository = response.data;

			setNewRepo('');
			setRepositories([...repositories, repository]);
		} catch (err) {
			setInputError('Erro na busca por esse repositório!');
		}
	}

	return (
		<>
			<img src={logo} alt="logo" />
			<Title>Explore repositórios no Github</Title>

			<Form hasError={!!inputError} onSubmit={handleAddRepository}>
				<input
					onChange={e => setNewRepo(e.target.value)}
					value={newRepo}
					placeholder="Digite o nome do repositório"
				/>
				<button type="submit">Salvar</button>
			</Form>

			{inputError && <Error>{inputError}</Error>}

			<Repositories>
				{repositories.map((repository: Repository) => (
					<Link
						key={repository.full_name}
						to={`/repository/${repository.full_name}`}
					>
						<img src={repository.owner.avatar_url} alt={repository.full_name} />
						<div>
							<strong>{repository.full_name}</strong>
							<p>{repository.description}</p>
						</div>
						<FiChevronRight size={20} />
					</Link>
				))}
			</Repositories>
		</>
	);
};

export default Dashboard;
