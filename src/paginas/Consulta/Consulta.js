import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Spinner, Card, Form, Button } from 'react-bootstrap';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { vendas } from '../../services/vendas';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const Consulta = () => {
    const [dadosGraficoPizza, setDadosGraficoPizza] = useState({});
    const [totalVendas, setTotalVendas] = useState(0);
    const [numeroTotalVendas, setNumeroTotalVendas] = useState(0);
    const [vendaMaisRecente, setVendaMaisRecente] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (inicio = null, fim = null) => {
        try {
            const vendasData = await vendas.obterVendasAsync();
            const totalPorTipo = {
                Dinheiro: 0,
                Pix: 0,
                'Cartão Débito': 0,
                'Cartão Crédito': 0,
            };

            let total = 0;
            let filteredVendas = vendasData;

            if (inicio && fim) {
                filteredVendas = vendasData.filter(venda => {
                    const dataVenda = new Date(venda.dataEHora);
                    return dataVenda >= new Date(inicio) && dataVenda <= new Date(fim);
                });
            }

            filteredVendas.forEach(venda => {
                total += venda.valor;
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

            setTotalVendas(total);
            setNumeroTotalVendas(filteredVendas.length);
            setVendaMaisRecente(filteredVendas[filteredVendas.length - 1]);

            setDadosGraficoPizza({
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

    const handleFilter = () => {
        if (dataInicio && dataFim) {
            fetchData(dataInicio, dataFim);
        } else {
            setErrorMessage('Por favor, selecione as datas de início e fim.');
        }
    };

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

            <Row className="mb-4">
                <Col>
                    <Form>
                        <Row>
                            <Col md={5}>
                                <Form.Group controlId="dataInicio">
                                    <Form.Label>Data Início</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dataInicio}
                                        onChange={(e) => setDataInicio(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={5}>
                                <Form.Group controlId="dataFim">
                                    <Form.Label>Data Fim</Form.Label>
                                    <Form.Control
                                        type="date"
                                        value={dataFim}
                                        onChange={(e) => setDataFim(e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={2} className="d-flex align-items-end">
                                <Button variant="primary" onClick={handleFilter}>
                                    Filtrar
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Col>
            </Row>

            <Row className="mb-4">
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Valor Total das Vendas</Card.Title>
                            <Card.Text>
                                R$ {totalVendas.toFixed(2)}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                <Col>
                    <Card>
                        <Card.Body>
                            <Card.Title>Número Total de Vendas</Card.Title>
                            <Card.Text>
                                {numeroTotalVendas}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
                {vendaMaisRecente && (
                    <Col>
                        <Card>
                            <Card.Body>
                                <Card.Title>Venda Mais Recente</Card.Title>
                                <Card.Text>
                                    <strong>Valor: </strong>R$ {vendaMaisRecente.valor.toFixed(2)}<br />
                                    <strong>Tipo de Pagamento: </strong>
                                    {vendaMaisRecente.tipoPagamentoId === 1 && 'Dinheiro'}
                                    {vendaMaisRecente.tipoPagamentoId === 2 && 'Pix'}
                                    {vendaMaisRecente.tipoPagamentoId === 3 && 'Cartão Débito'}
                                    {vendaMaisRecente.tipoPagamentoId === 4 && 'Cartão Crédito'}<br />
                                    <strong>Data e Hora:</strong> {new Date(vendaMaisRecente.dataEHora).toLocaleString('pt-BR')}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                )}
            </Row>

            <Row className="justify-content-md-center mb-4">
                <Col md={6}>
                    <div style={{ position: 'relative', width: '100%', height: 'auto' }}>
                        <Pie
                            data={dadosGraficoPizza}
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
