import asyncio
from pentest_mcp.llm_providers import get_llm_provider
from pentest_mcp.config import settings

async def test_report():
    print(f"Provider: {settings.llm_provider}")
    prov = get_llm_provider()
    try:
        res = await prov.generate_report('http://localhost:3001', [], {'mode': 'quick'})
        print('Report generated successfully')
        print(res[:200])
    except Exception as e:
        print(f'Error: {e}')
        import traceback
        traceback.print_exc()

asyncio.run(test_report())
