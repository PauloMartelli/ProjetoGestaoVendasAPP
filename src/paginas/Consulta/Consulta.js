import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { vendas } from '../../services/vendas';


ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Consulta = () => {
    const [dadosGrafico, setDadosGrafico] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const vendasData = await vendas.obterVendasAsync();
                const totalPorTipo = {
                    Dinheiro: 0,
                    Pix: 0,
                    'Cartão Débito': 0,
                    'Cartão Crédito': 0,
                };

                vendasData.forEach(venda => {
                    switch (venda.tipoPagamentoId) {
                        case 1:
                            totalPorTipo.Dinheiro += venda.valor;
                            break;
                        case 2:
                            totalPorTipo.Pix += venda.valor;
                            break;
                        case 3:
                            totalPorTipo['Cartão Débito'] += venda.valor;
                            break;
                        case 4:
                            totalPorTipo['Cartão Crédito'] += venda.valor;
                            break;
                        default:
                            break;
                    }
                });

                setDadosGrafico({
                    labels: Object.keys(totalPorTipo),
                    datasets: [
                        {
                            data: Object.values(totalPorTipo),
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                        },
                    ],
                });
            } catch (error) {
                console.error('Erro ao obter as vendas:', error);
                setErrorMessage('Erro ao obter as vendas.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5">
                <Spinner animation="border" variant="primary" />
                <p>Carregando dados...</p>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            <Row className="justify-content-md-center">
                <Col md={6}>
                    <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                        <Pie
                            data={dadosGrafico}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    tooltip: {
                                        callbacks: {
                                            label: (context) => {
                                                const label = context.label || '';
                                                const value = context.raw || 0;
                                                return `${label}: R$ ${value.toFixed(2)}`;
                                            },
                                        },
                                    },
                                },
                            }}
                            style={{ width: '100%', height: '100%' }}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Consulta;
