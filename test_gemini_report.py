import asyncio
from pentest_mcp.llm_providers import GeminiProvider
import traceback

async def test_report():
    prov = GeminiProvider()
    try:
        # Minimal data for report generation
        res = await prov.generate_report('http://localhost:3001', [], {'mode': 'quick'})
        print('Report generated successfully')
        print(res[:200])
    except Exception as e:
        print(f'Error: {e}')
        traceback.print_exc()

asyncio.run(test_report())
