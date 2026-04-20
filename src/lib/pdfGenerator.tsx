import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// Professional PDF Styles
const styles = StyleSheet.create({
    page: {
        backgroundColor: '#ffffff',
        padding: 40,
        fontFamily: 'Helvetica'
    },
    header: {
        marginBottom: 30,
        borderBottom: '2 solid #6366f1',
        paddingBottom: 15
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1e293b',
        marginBottom: 8
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 4
    },
    section: {
        marginTop: 20,
        marginBottom: 15
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#6366f1',
        marginBottom: 10,
        textTransform: 'uppercase',
        letterSpacing: 0.5
    },
    text: {
        fontSize: 10,
        color: '#334155',
        lineHeight: 1.6,
        marginBottom: 6
    },
    step: {
        fontSize: 10,
        color: '#1e293b',
        marginBottom: 8,
        paddingLeft: 15,
        lineHeight: 1.5
    },
    table: {
        marginTop: 10,
        marginBottom: 10
    },
    tableRow: {
        flexDirection: 'row',
        borderBottom: '1 solid #e2e8f0',
        paddingVertical: 8
    },
    tableCell: {
        fontSize: 9,
        color: '#475569',
        flex: 1
    },
    tableHeader: {
        fontSize: 9,
        fontWeight: 'bold',
        color: '#1e293b',
        flex: 1
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 8,
        color: '#94a3b8',
        borderTop: '1 solid #e2e8f0',
        paddingTop: 10
    },
    badge: {
        backgroundColor: '#f1f5f9',
        color: '#475569',
        padding: '4 8',
        borderRadius: 4,
        fontSize: 8,
        marginRight: 8,
        display: 'flex'
    },
    highlight: {
        backgroundColor: '#eff6ff',
        padding: 12,
        borderLeft: '3 solid #6366f1',
        marginVertical: 10,
        borderRadius: 4
    },
    box: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 6,
        marginBottom: 10
    }
});

interface ProfessionalPlaybookDocumentProps {
    playbookData: any;
    metadata: {
        industry?: string;
        category?: string;
        version?: string;
    };
}

export const ProfessionalPlaybookDocument = ({ playbookData, metadata }: ProfessionalPlaybookDocumentProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{playbookData.title || 'Standard Operating Procedure'}</Text>
                <Text style={styles.subtitle}>
                    Industry: {metadata.industry || 'General'} | Category: {metadata.category || 'Operations'} | Version: {metadata.version || '1.0'}
                </Text>
                <Text style={styles.subtitle}>
                    Generated: {new Date().toLocaleDateString()} | Status: DRAFT - Pending Approval
                </Text>
            </View>

            {/* Executive Summary */}
            {playbookData.purpose && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📋 Executive Summary</Text>
                    <View style={styles.highlight}>
                        <Text style={styles.text}>{playbookData.purpose}</Text>
                    </View>
                </View>
            )}

            {/* Scope */}
            {playbookData.scope && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🎯 Scope</Text>
                    <Text style={styles.text}>{playbookData.scope}</Text>
                </View>
            )}

            {/* Audience */}
            {playbookData.audience && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👥 Target Audience</Text>
                    <Text style={styles.text}>{playbookData.audience}</Text>
                </View>
            )}

            {/* Responsible Parties */}
            {playbookData.responsibleParties && playbookData.responsibleParties.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>👔 Roles & Responsibilities</Text>
                    {playbookData.responsibleParties.map((party: any, idx: number) => (
                        <View key={idx} style={styles.box}>
                            <Text style={{ ...styles.text, fontWeight: 'bold', marginBottom: 4 }}>{party.role}</Text>
                            {party.responsibilities && party.responsibilities.map((resp: string, i: number) => (
                                <Text key={i} style={styles.text}>• {resp}</Text>
                            ))}
                            {party.authority && (
                                <Text style={{ ...styles.text, fontSize: 9, color: '#6366f1', marginTop: 4 }}>
                                    Authority: {party.authority}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
            )}

            {/* Tools Required */}
            {playbookData.toolsRequired && playbookData.toolsRequired.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🛠️ Tools & Systems</Text>
                    {playbookData.toolsRequired.map((tool: any, idx: number) => (
                        <View key={idx} style={styles.box}>
                            <Text style={{ ...styles.text, fontWeight: 'bold' }}>{tool.name}</Text>
                            <Text style={styles.text}>Purpose: {tool.purpose}</Text>
                            <Text style={{ ...styles.text, fontSize: 9 }}>Access: {tool.accessLevel}</Text>
                        </View>
                    ))}
                </View>
            )}
        </Page>

        {/* Page 2: Procedures */}
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>📝 Step-by-Step Procedures</Text>
                {playbookData.steps && playbookData.steps.map((step: string, idx: number) => (
                    <View key={idx} style={{ marginBottom: 12, paddingLeft: 10 }}>
                        <Text style={styles.step}>
                            {idx + 1}. {step}
                        </Text>
                    </View>
                ))}
            </View>

            {/* Quality Checks */}
            {playbookData.qualityChecks && playbookData.qualityChecks.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✅ Quality Checkpoints</Text>
                    {playbookData.qualityChecks.map((check: string, idx: number) => (
                        <Text key={idx} style={styles.text}>✓ {check}</Text>
                    ))}
                </View>
            )}

            {/* KPIs */}
            {playbookData.kpis && playbookData.kpis.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📊 Key Performance Indicators</Text>
                    <View style={styles.table}>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableHeader}>Metric</Text>
                            <Text style={styles.tableHeader}>Target</Text>
                            <Text style={styles.tableHeader}>Measurement</Text>
                        </View>
                        {playbookData.kpis.map((kpi: any, idx: number) => (
                            <View key={idx} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{kpi.metric}</Text>
                                <Text style={styles.tableCell}>{kpi.target}</Text>
                                <Text style={styles.tableCell}>{kpi.measurement}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            )}
        </Page>

        {/* Page 3: Errors & Compliance */}
        <Page size="A4" style={styles.page}>
            {/* Common Errors */}
            {playbookData.commonErrors && playbookData.commonErrors.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>⚠️ Common Errors & Resolutions</Text>
                    {playbookData.commonErrors.map((error: any, idx: number) => (
                        <View key={idx} style={styles.box}>
                            <Text style={{ ...styles.text, fontWeight: 'bold', color: '#dc2626' }}>
                                Error: {error.error}
                            </Text>
                            <Text style={styles.text}>Impact: {error.consequences}</Text>
                            <Text style={styles.text}>Prevention: {error.prevention}</Text>
                            <Text style={{ ...styles.text, color: '#16a34a' }}>Resolution: {error.resolution}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Compliance */}
            {playbookData.compliance && playbookData.compliance.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>🔒 Compliance Requirements</Text>
                    {playbookData.compliance.map((item: string, idx: number) => (
                        <Text key={idx} style={styles.text}>• {item}</Text>
                    ))}
                </View>
            )}

            {/* Approval Chain */}
            {playbookData.approvalChain && playbookData.approvalChain.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>✍️ Approval Chain</Text>
                    {playbookData.approvalChain.map((approver: string, idx: number) => (
                        <Text key={idx} style={styles.text}>
                            {idx + 1}. {approver}
                        </Text>
                    ))}
                </View>
            )}

            {/* Revision History */}
            {playbookData.revisionHistory && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>📅 Revision History</Text>
                    <View style={styles.box}>
                        <Text style={styles.text}>Version: {playbookData.revisionHistory.version}</Text>
                        <Text style={styles.text}>Date: {playbookData.revisionHistory.date}</Text>
                        <Text style={styles.text}>Author: {playbookData.revisionHistory.author}</Text>
                        <Text style={styles.text}>Changes: {playbookData.revisionHistory.changes}</Text>
                    </View>
                </View>
            )}

            {/* Footer */}
            <View style={styles.footer}>
                <Text>Generated by PlaybookMaster Enterprise Platform | Confidential & Proprietary</Text>
                <Text>This document is subject to change. Always refer to the latest version in the system.</Text>
            </View>
        </Page>
    </Document >
);

// Export function to generate professional PDF
export async function generateProfessionalPDF(playbookData: any, metadata: any) {
    const blob = await pdf(<ProfessionalPlaybookDocument playbookData={playbookData} metadata={metadata} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${playbookData.title?.replace(/[^a-z0-9]/gi, '_') || 'Playbook'}_v${metadata.version || '1.0'}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
}
